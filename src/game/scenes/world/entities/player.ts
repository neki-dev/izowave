import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import {
  PLAYER_TILE_SIZE, PLAYER_MOVE_DIRECTIONS, PLAYER_MOVE_ANIMATIONS, PLAYER_UPGRADES,
} from '~const/world/entities/player';
import { LEVEL_MAP_VISITED_TILE_TINT } from '~const/world/level';
import { Crystal } from '~entity/crystal';
import { Assistant } from '~entity/npc/variants/assistant';
import { Sprite } from '~entity/sprite';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { aroundPosition, progression } from '~lib/utils';
import { NoticeType } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { IAssistant } from '~type/world/entities/npc/assistant';
import { IEnemy } from '~type/world/entities/npc/enemy';
import {
  PlayerTexture, MovementDirection, PlayerAudio, PlayerData, IPlayer, PlayerUpgrade,
} from '~type/world/entities/player';
import { BiomeType, TileType } from '~type/world/level';
import { WaveEvents } from '~type/world/wave';

export class Player extends Sprite implements IPlayer {
  private _experience: number = 0;

  public get experience() { return this._experience; }

  private set experience(v) { this._experience = v; }

  private _resources: number = DIFFICULTY.PLAYER_START_RESOURCES;

  public get resources() { return this._resources; }

  private set resources(v) { this._resources = v; }

  private _kills: number = 0;

  public get kills() { return this._kills; }

  private set kills(v) { this._kills = v; }

  private _upgradeLevel: Record<PlayerUpgrade, number> = {
    [PlayerUpgrade.MAX_HEALTH]: 1,
    [PlayerUpgrade.SPEED]: 1,
    [PlayerUpgrade.BUILD_AREA]: 1,
    [PlayerUpgrade.ASSISTANT]: 1,
  };

  public get upgradeLevel() { return this._upgradeLevel; }

  private set upgradeLevel(v) { this._upgradeLevel = v; }

  private movementKeys: Nullable<Record<string, Phaser.Input.Keyboard.Key>> = null;

  private direction: number = 0;

  private isMoving: boolean = false;

  private assistant: Nullable<IAssistant> = null;

  constructor(scene: IWorld, data: PlayerData) {
    super(scene, {
      ...data,
      texture: PlayerTexture.PLAYER,
      health: DIFFICULTY.PLAYER_HEALTH,
      speed: DIFFICULTY.PLAYER_SPEED,
    });
    scene.add.existing(this);

    this.registerKeyboard();
    this.registerAnimations();

    this.addAssistant();

    this.body.setCircle(3, 5, 10);
    this.setScale(2.0);
    this.setOrigin(0.5, 0.75);

    this.addHealthIndicator(0xd0ff4f);

    this.setTilesGroundCollision(true);
    this.setTilesCollision([
      TileType.MAP,
      TileType.BUILDING,
      TileType.CRYSTAL,
    ], (tile) => {
      if (tile instanceof Crystal) {
        tile.pickup();
      }
    });

    this.scene.physics.add.collider(this, this.scene.entityGroups.enemies, (_, enemy: IEnemy) => {
      enemy.attack(this);
    });

    this.scene.wave.on(WaveEvents.COMPLETE, (number: number) => {
      this.onWaveComplete(number);
    });
  }

  public update() {
    super.update();

    if (this.live.isDead()) {
      return;
    }

    this.addVisitedWay();
    this.updateDirection();
    this.updateVelocity();
  }

  public giveExperience(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.experience += amount / this.scene.game.getDifficultyMultiplier();
  }

  public giveResources(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.resources += amount;
  }

  public takeResources(amount: number) {
    this.resources -= amount;
  }

  public incrementKills() {
    this.kills++;
  }

  public getExperienceToUpgrade(type: PlayerUpgrade) {
    return progression(
      PLAYER_UPGRADES[type].experience,
      DIFFICULTY.PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH,
      this.upgradeLevel[type],
      10,
    );
  }

  private getUpgradeNextValue(type: PlayerUpgrade): number {
    const nextLevel = this.upgradeLevel[type] + 1;

    switch (type) {
      case PlayerUpgrade.MAX_HEALTH: {
        return progression(
          DIFFICULTY.PLAYER_HEALTH,
          DIFFICULTY.PLAYER_HEALTH_GROWTH,
          nextLevel,
          5,
        );
      }
      case PlayerUpgrade.SPEED: {
        return progression(
          DIFFICULTY.PLAYER_SPEED,
          DIFFICULTY.PLAYER_SPEED_GROWTH,
          nextLevel,
        );
      }
      case PlayerUpgrade.BUILD_AREA: {
        return progression(
          DIFFICULTY.BUILDER_BUILD_AREA,
          DIFFICULTY.BUILDER_BUILD_AREA_GROWTH,
          nextLevel,
        );
      }
      case PlayerUpgrade.ASSISTANT: {
        return nextLevel;
      }
    }
  }

  public upgrade(type: PlayerUpgrade) {
    if (this.scene.wave.isGoing) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'CANNOT BE UPGRADED WHILE WAVE IS GOING');

      return;
    }

    const experience = this.getExperienceToUpgrade(type);

    if (this.experience < experience) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'NOT ENOUGH EXPERIENCE');

      return;
    }

    const nextValue = this.getUpgradeNextValue(type);

    switch (type) {
      case PlayerUpgrade.MAX_HEALTH: {
        this.live.setMaxHealth(nextValue);
        this.live.heal();
        if (this.assistant) {
          this.assistant.live.setMaxHealth(nextValue);
          this.assistant.live.heal();
        }
        break;
      }
      case PlayerUpgrade.SPEED: {
        this.speed = nextValue;
        if (this.assistant) {
          this.assistant.speed = nextValue;
        }
        break;
      }
      case PlayerUpgrade.BUILD_AREA: {
        this.scene.builder.radius = nextValue;
        break;
      }
      case PlayerUpgrade.ASSISTANT: {
        if (this.assistant) {
          this.assistant.level = nextValue;
        }
        break;
      }
    }

    this.experience -= experience;
    this.upgradeLevel[type]++;

    this.scene.sound.play(PlayerAudio.UPGRADE);
    this.scene.game.screen.notice(NoticeType.INFO, `${type.toUpperCase().replace('_', ' ')} UPGRADED`);

    this.scene.game.tutorial.end(TutorialStep.UPGRADE_PLAYER);
  }

  public onDamage() {
    this.scene.game.sound.play(
      Phaser.Utils.Array.GetRandom([
        PlayerAudio.DAMAGE_1,
        PlayerAudio.DAMAGE_2,
        PlayerAudio.DAMAGE_3,
      ]),
    );

    super.onDamage();
  }

  public onDead() {
    this.scene.cameras.main.zoomTo(2.0, 10 * 1000);
    this.scene.sound.play(PlayerAudio.DEAD);

    this.stopMovement();
    this.scene.tweens.add({
      targets: [this, this.container],
      alpha: 0.0,
      duration: 250,
    });
  }

  private addAssistant() {
    const positionAtMatrix = aroundPosition(this.positionAtMatrix).find((spawn) => {
      const tileGround = this.scene.level.getTile({ ...spawn, z: 0 });

      return Boolean(tileGround);
    });

    this.assistant = new Assistant(this.scene, {
      owner: this,
      positionAtMatrix: positionAtMatrix || this.positionAtMatrix,
      speed: this.speed,
      health: this.live.maxHealth,
      level: this.upgradeLevel[PlayerUpgrade.ASSISTANT],
    });

    this.assistant.on(Phaser.Scenes.Events.DESTROY, () => {
      this.assistant = null;
    });
  }

  private onWaveComplete(number: number) {
    if (this.assistant) {
      this.assistant.live.heal();
    } else {
      this.addAssistant();
    }

    const experience = progression(
      DIFFICULTY.WAVE_EXPERIENCE,
      DIFFICULTY.WAVE_EXPERIENCE_GROWTH,
      number,
    );

    this.giveExperience(experience);

    if (number === 1) {
      this.scene.game.tutorial.beg(TutorialStep.UPGRADE_PLAYER);
    }
  }

  private registerKeyboard() {
    this.movementKeys = <Record<string, Phaser.Input.Keyboard.Key>> this.scene.input.keyboard.addKeys(
      CONTROL_KEY.MOVEMENT,
    );
  }

  private updateVelocity() {
    if (!this.isMoving) {
      this.setVelocity(0, 0);
      this.body.setImmovable(true);

      return;
    }

    const collide = this.handleCollide(this.direction);

    if (collide) {
      this.setVelocity(0, 0);
      this.body.setImmovable(true);

      return;
    }

    const friction = this.currentGroundTile?.biome?.friction ?? 1;
    const speed = this.speed / friction;
    const velocity = this.scene.physics.velocityFromAngle(this.direction, speed);

    this.body.setImmovable(false);
    this.setVelocity(velocity.x, velocity.y);
  }

  private updateDirection() {
    const x = this.getKeyboardSingleDirection([['LEFT', 'A'], ['RIGHT', 'D']]);
    const y = this.getKeyboardSingleDirection([['UP', 'W'], ['DOWN', 'S']]);
    const key = `${x}|${y}`;

    const oldMoving = this.isMoving;
    const oldDirection = this.direction;

    if (x !== 0 || y !== 0) {
      this.isMoving = true;
      this.direction = PLAYER_MOVE_DIRECTIONS[key];
    } else {
      this.isMoving = false;
    }

    if (oldMoving !== this.isMoving || oldDirection !== this.direction) {
      if (this.isMoving) {
        this.anims.play(PLAYER_MOVE_ANIMATIONS[key]);

        if (!oldMoving) {
          this.scene.game.sound.play(PlayerAudio.WALK, {
            loop: true,
            rate: 1.8,
          });
        }
      } else {
        this.stopMovement();
      }
    }
  }

  private stopMovement() {
    if (this.anims.currentAnim) {
      this.anims.setProgress(0);
      this.anims.stop();
    }

    this.scene.sound.stopByKey(PlayerAudio.WALK);
  }

  private getKeyboardSingleDirection(
    controls: [keyof typeof MovementDirection, string][],
  ) {
    for (const [core, alias] of controls) {
      if (this.movementKeys[core].isDown || this.movementKeys[alias].isDown) {
        return MovementDirection[core];
      }
    }

    return MovementDirection.NONE;
  }

  private addVisitedWay() {
    if (!this.currentGroundTile?.biome) {
      return;
    }

    if ([BiomeType.SAND, BiomeType.GRASS].includes(this.currentGroundTile.biome.type)) {
      this.currentGroundTile.setTint(LEVEL_MAP_VISITED_TILE_TINT);
    }
  }

  private registerAnimations() {
    let frameIndex = 0;

    for (const key of Object.values(PLAYER_MOVE_ANIMATIONS)) {
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(PlayerTexture.PLAYER, {
          start: frameIndex * 4,
          end: (frameIndex + 1) * 4 - 1,
        }),
        frameRate: 8,
        repeat: -1,
      });
      frameIndex++;
    }
  }
}

registerAudioAssets(PlayerAudio);
registerSpriteAssets(PlayerTexture, {
  width: PLAYER_TILE_SIZE[0],
  height: PLAYER_TILE_SIZE[1],
});

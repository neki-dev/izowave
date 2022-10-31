import Phaser from 'phaser';
import { DIFFICULTY } from '~const/difficulty';
import { LEVEL_MAP_VISITED_TILE_TINT } from '~const/level';
import {
  PLAYER_RECORD_KEY, PLAYER_TILE_SIZE, PLAYER_MOVE_DIRECTIONS, PLAYER_MOVE_ANIMATIONS,
} from '~const/player';
import { Chest } from '~entity/chest';
import { Assistant } from '~entity/npc/variants/assistant';
import { Sprite } from '~entity/sprite';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { keys } from '~lib/system';
import { aroundPosition, calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { NoticeType } from '~type/screen/notice';
import {
  PlayerEvents, PlayerTexture, MovementDirection, PlayerStat, PlayerAudio,
} from '~type/world/entities/player';
import { BiomeType, TileType } from '~type/world/level';
import { WaveEvents } from '~type/world/wave';

export class Player extends Sprite {
  /**
   * Player level.
   */
  private _level: number = 1;

  public get level() { return this._level; }

  private set level(v) { this._level = v; }

  /**
   * Player experience on current level.
   */
  private _experience: number = 0;

  public get experience() { return this._experience; }

  private set experience(v) { this._experience = v; }

  /**
   * Resourses amount.
   */
  private _resources: number = DIFFICULTY.PLAYER_START_RESOURCES;

  public get resources() { return this._resources; }

  private set resources(v) { this._resources = v; }

  /**
   * Total number of enemies killed.
   */
  private kills: number = 0;

  /**
   * Speed without friction.
   */
  private speed: number = DIFFICULTY.PLAYER_SPEED;

  /**
   * Keyboard keys.
   */
  private cursors: Nullable<Record<string, Phaser.Input.Keyboard.Key>> = null;

  /**
   * Current direction in deg.
   */
  private direction: number = 0;

  /**
   * Player is movement.
   */
  private movement: boolean = false;

  /**
   * Player NPC assistant.
   */
  private assistant: Nullable<Assistant> = null;

  /**
   * Current ground tile.
   */
  private tile: Nullable<Phaser.GameObjects.Image> = null;

  /**
   * Player constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      texture: PlayerTexture.PLAYER,
      positionAtMatrix,
      health: DIFFICULTY.PLAYER_HEALTH,
    });
    scene.add.existing(this);

    this.registerKeyboard();
    this.registerAnimations();

    this.addAssistant();

    // Configure physics

    this.body.setCircle(3, 5, 10);
    this.setScale(2.0);
    this.setOrigin(0.5, 0.75);

    this.setTilesGroundCollision(true);
    this.setTilesCollision([
      TileType.MAP,
      TileType.BUILDING,
      TileType.CHEST,
    ], (tile) => {
      if (tile instanceof Chest) {
        tile.open();
      }
    });

    // Add events callbacks

    this.scene.wave.on(WaveEvents.COMPLETE, (number: number) => {
      this.onWaveComplete(number);
    });
  }

  /**
   * Event update.
   */
  public update() {
    super.update();

    if (this.live.isDead()) {
      return;
    }

    this.tile = this.scene.level.getTile({
      ...this.positionAtMatrix,
      z: 0,
    });

    this.addVisitedWay();
    this.updateDirection();
    this.updateVelocity();
  }

  /**
   * Give player experince.
   * If enough experience, the level will be increased.
   *
   * @param amount - Amount
   */
  public giveExperience(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.experience += amount;
    this.emit(PlayerEvents.UPDATE_EXPERIENCE, amount);

    const calcNext = (level: number) => calcGrowth(
      DIFFICULTY.EXPERIENCE_TO_NEXT_LEVEL,
      DIFFICULTY.EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
      this.level + level + 1,
    );

    let experienceNeed = calcNext(0);
    let experienceLeft = this.experience;
    let level = 0;

    while (experienceLeft >= experienceNeed) {
      level++;
      experienceLeft -= experienceNeed;
      experienceNeed = calcNext(level);
    }

    if (level > 0) {
      this.experience = experienceLeft;
      this.nextLevel(level);
    }
  }

  /**
   * Give player resources.
   *
   * @param amount - Resources amount
   */
  public giveResources(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.resources += amount;
    this.emit(PlayerEvents.UPDATE_RESOURCE, amount);
  }

  /**
   * Take player resources.
   *
   * @param amount - Resources amount
   */
  public takeResources(amount: number) {
    this.resources -= amount;
    this.emit(PlayerEvents.UPDATE_RESOURCE, -amount);
  }

  /**
   * Inremeting number of enemies killed.
   */
  public incrementKills() {
    this.kills++;
  }

  /**
   * Event dead.
   */
  public onDead() {
    super.onDead();

    this.stopMovement();
    this.scene.cameras.main.zoomTo(2.0, 10 * 1000);
    this.scene.sound.play(PlayerAudio.DEAD);

    const record = this.readBestStat();
    const stat = this.getStat();

    this.writeBestStat(stat, record);

    this.scene.tweens.add({
      targets: [this, this.container],
      alpha: 0.0,
      duration: 250,
      onComplete: () => {
        this.scene.finishGame(stat, record);
      },
    });
  }

  /**
   * Spawn assistant.
   */
  private addAssistant() {
    const positionAtMatrix = aroundPosition(this.positionAtMatrix, 1).find((spawn) => {
      const tileGround = this.scene.level.getTile({ ...spawn, z: 0 });

      return Boolean(tileGround);
    });

    this.assistant = new Assistant(this.scene, {
      positionAtMatrix: positionAtMatrix || this.positionAtMatrix,
    });

    this.assistant.upgrade(this.level);

    this.assistant.on(Phaser.Scenes.Events.DESTROY, () => {
      this.assistant = null;
    });
  }

  /**
   * Upgrade player to next level.
   *
   * @param count - Levels count
   */
  private nextLevel(count: number) {
    this.level += count;

    // Upgrade assistant
    if (this.assistant) {
      this.assistant.upgrade(this.level);
    }

    // Update maximum player health by level
    const maxHealth = calcGrowth(
      DIFFICULTY.PLAYER_HEALTH,
      DIFFICULTY.PLAYER_HEALTH_GROWTH,
      this.level,
    );

    this.live.setMaxHealth(maxHealth);
    this.live.heal();

    this.scene.sound.play(PlayerAudio.LEVEL_UP);
    this.scene.screen.message(NoticeType.INFO, 'LEVEL UP');
  }

  /**
   * Event wave complete.
   *
   * @param number - Wave number
   */
  private onWaveComplete(number: number) {
    // Respawn assistant
    if (!this.assistant) {
      this.addAssistant();
    }

    // Give experience
    const experience = calcGrowth(
      DIFFICULTY.WAVE_EXPERIENCE,
      DIFFICULTY.WAVE_EXPERIENCE_GROWTH,
      number,
    );

    this.giveExperience(experience);
  }

  /**
   * Bind keyboard keys for movement.
   */
  private registerKeyboard() {
    const movementKeys = 'W,A,S,D,UP,LEFT,DOWN,RIGHT';

    this.cursors = <Record<string, Phaser.Input.Keyboard.Key>> this.scene.input.keyboard.addKeys(movementKeys);
  }

  /**
   * Update velocity with handle collide.
   */
  private updateVelocity() {
    if (!this.movement) {
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

    const friction = this.tile ? this.tile.biome.friction : 1;
    const speed = this.speed / friction;
    const velocity = this.scene.physics.velocityFromAngle(this.direction, speed);

    this.body.setImmovable(false);
    this.setVelocity(velocity.x, velocity.y);
  }

  /**
   * Update move direction and animation.
   */
  private updateDirection() {
    const x = this.getKeyboardSingleDirection([['LEFT', 'A'], ['RIGHT', 'D']]);
    const y = this.getKeyboardSingleDirection([['UP', 'W'], ['DOWN', 'S']]);
    const key = `${x}|${y}`;

    const oldMovement = this.movement;
    const oldDirection = this.direction;

    if (x !== 0 || y !== 0) {
      this.movement = true;
      this.direction = PLAYER_MOVE_DIRECTIONS[key];
    } else {
      this.movement = false;
    }

    if (oldMovement !== this.movement || oldDirection !== this.direction) {
      if (this.movement) {
        const animation = PLAYER_MOVE_ANIMATIONS[key];

        this.anims.play(animation);

        if (!oldMovement) {
          this.scene.sound.play(PlayerAudio.MOVE, {
            loop: true,
            rate: 1.8,
          });
        }
      } else {
        this.stopMovement();
      }
    }
  }

  /**
   * Stop movement animation and audio.
   */
  private stopMovement() {
    this.anims.setProgress(0);
    this.anims.stop();

    this.scene.sound.stopByKey(PlayerAudio.MOVE);
  }

  /**
   * Get single move direction by keys state.
   *
   * @param controls - Keyboard keys
   */
  private getKeyboardSingleDirection(
    controls: [keyof typeof MovementDirection, string][],
  ): MovementDirection {
    for (const [core, alias] of controls) {
      if (this.cursors[core].isDown || this.cursors[alias].isDown) {
        return MovementDirection[core];
      }
    }

    return MovementDirection.NONE;
  }

  /**
   * Change ground tile tint.
   */
  private addVisitedWay() {
    if (!this.tile) {
      return;
    }

    if ([BiomeType.SAND, BiomeType.GRASS].includes(this.tile.biome.type)) {
      this.tile.setTint(LEVEL_MAP_VISITED_TILE_TINT);
    }
  }

  /**
   * Get current game stat.
   */
  private getStat(): PlayerStat {
    return {
      waves: this.scene.wave.getCurrentNumber() - 1,
      kills: this.kills,
      level: this.level,
      lived: this.scene.getTimerNow() / 1000 / 60,
    };
  }

  /**
   * Get and save current game stat.
   */
  private readBestStat(): PlayerStat {
    const recordValue = localStorage.getItem(`${PLAYER_RECORD_KEY}.${this.scene.difficultyType}`);

    return recordValue ? JSON.parse(recordValue) : {};
  }

  /**
   * Get and save current game stat.
   */
  private writeBestStat(stat: PlayerStat, record: PlayerStat) {
    localStorage.setItem(`${PLAYER_RECORD_KEY}.${this.scene.difficultyType}`, JSON.stringify(
      keys(stat).reduce((curr, param) => ({
        ...curr,
        [param]: Math.max(stat[param], record[param] || 0),
      }), {}),
    ));
  }

  /**
   * Add animations for all move directions.
   */
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

import { DIFFICULTY } from '~const/world/difficulty';
import { ASSISTANT_PATH_BREAKPOINT, ASSISTANT_TILE_SIZE } from '~const/world/entities/assistant';
import { NPC } from '~entity/npc';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { progressionQuadratic, getClosest } from '~lib/utils';
import { Effect } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { EffectTexture } from '~type/world/effects';
import {
  AssistantTexture, AssistantData, AssistantAudio, IAssistant,
} from '~type/world/entities/npc/assistant';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { IShot, ShotParams } from '~type/world/entities/shot';

export class Assistant extends NPC implements IAssistant {
  private shot: IShot;

  private owner: IPlayer;

  private shotDefaultParams: ShotParams;

  private nextAttackTimestamp: number = 0;

  public level: number = 1;

  constructor(scene: IWorld, {
    owner, positionAtMatrix, speed, health, level,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.ASSISTANT,
      positionAtMatrix,
      speed,
      health,
      pathFindTriggerDistance: ASSISTANT_PATH_BREAKPOINT,
    });
    scene.add.existing(this);

    this.shot = new ShotBallFire(scene, {
      maxDistance: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      speed: DIFFICULTY.ASSISTANT_ATTACK_SPEED,
      damage: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE,
    });
    this.shot.setInitiator(this);
    this.shotDefaultParams = this.shot.params;

    this.gamut = ASSISTANT_TILE_SIZE.gamut;
    this.owner = owner;
    this.level = level;

    this.body.setCircle(this.width / 2, 0, 1);

    this.addHealthIndicator(0xd0ff4f);

    this.scene.physics.add.collider(this, this.scene.entityGroups.enemies, (_, enemy: IEnemy) => {
      enemy.attack(this);
    });
  }

  public update() {
    super.update();

    if (this.isPathPassed) {
      this.setVelocity(0, 0);
    }

    if (this.isCanAttack()) {
      this.attack();
    }
  }

  public onDamage() {
    this.scene.game.sound.play(
      Phaser.Utils.Array.GetRandom([
        AssistantAudio.DAMAGE_1,
        AssistantAudio.DAMAGE_2,
      ]),
    );

    super.onDamage();
  }

  public onDead() {
    if (this.visible && this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Effect(this.scene, {
        texture: EffectTexture.EXPLOSION,
        audio: AssistantAudio.DEAD,
        position: this.body.center,
      });
    }

    super.onDead();
  }

  private isCanAttack() {
    return (
      this.nextAttackTimestamp < this.scene.getTime()
      && !this.owner.live.isDead()
    );
  }

  private attack() {
    const target = this.getTarget();

    if (!target) {
      return;
    }

    this.shot.params = this.getShotCurrentParams();
    this.shot.shoot(target);

    const now = this.scene.getTime();
    const pause = progressionQuadratic(
      DIFFICULTY.ASSISTANT_ATTACK_PAUSE,
      DIFFICULTY.ASSISTANT_ATTACK_PAUSE_GROWTH,
      this.level,
    );

    this.nextAttackTimestamp = now + Math.max(pause, 200);
  }

  private getTarget(): Nullable<IEnemy> {
    const maxDistance = progressionQuadratic(
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
      this.level,
    );

    const enemies = this.scene.getEnemies().filter((enemy) => {
      if (enemy.live.isDead()) {
        return false;
      }

      const positionFrom = this.getPositionOnGround();
      const positionTo = enemy.getPositionOnGround();

      return (
        Phaser.Math.Distance.BetweenPoints(positionFrom, positionTo) <= maxDistance
        && !this.scene.level.hasTilesBetweenPositions(positionFrom, positionTo)
      );
    });

    return getClosest(enemies, this);
  }

  private getShotCurrentParams() {
    const params: ShotParams = {
      maxDistance: progressionQuadratic(
        this.shotDefaultParams.maxDistance,
        DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
        this.level,
      ),
      speed: progressionQuadratic(
        this.shotDefaultParams.speed,
        DIFFICULTY.ASSISTANT_ATTACK_SPEED_GROWTH,
        this.level,
      ),
      damage: progressionQuadratic(
        this.shotDefaultParams.damage,
        DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_GROWTH,
        this.level,
      ),
    };

    return params;
  }
}

registerAudioAssets(AssistantAudio);
registerSpriteAssets(AssistantTexture, ASSISTANT_TILE_SIZE);

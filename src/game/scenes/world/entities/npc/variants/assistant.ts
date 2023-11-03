import { DIFFICULTY } from '~const/world/difficulty';
import { ASSISTANT_PATH_BREAKPOINT, ASSISTANT_TILE_SIZE, ASSISTANT_WEAPON } from '~const/world/entities/assistant';
import { NPC } from '~entity/npc';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { Assets } from '~lib/assets';
import { getClosestByIsometricDistance, getIsometricDistance } from '~lib/dimension';
import { progressionQuadratic } from '~lib/progression';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import {
  AssistantTexture,
  AssistantData,
  IAssistant,
  AssistantVariant,
  AssistantEvents,
} from '~type/world/entities/npc/assistant';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer, PlayerSkill } from '~type/world/entities/player';
import { IShot, IShotFactory, ShotParams } from '~type/world/entities/shot';
import { WaveEvents } from '~type/world/wave';

Assets.RegisterSprites(AssistantTexture, ASSISTANT_TILE_SIZE);

export class Assistant extends NPC implements IAssistant {
  private shot: IShot;

  private owner: IPlayer;

  private shotDefaultParams: ShotParams;

  private nextAttackTimestamp: number = 0;

  private instantShot: boolean = true;

  private variant: AssistantVariant;

  constructor(scene: IWorld, {
    owner, positionAtMatrix, speed,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.DEFAULT,
      positionAtMatrix,
      speed,
      pathFindTriggerDistance: ASSISTANT_PATH_BREAKPOINT,
      seesInvisibleTarget: true,
      customAnimation: true,
      body: {
        ...ASSISTANT_TILE_SIZE,
        type: 'circle',
      },
    });
    scene.add.existing(this);

    this.owner = owner;

    this.registerAnimations();
    this.updateVariant();

    this.scene.wave.on(WaveEvents.COMPLETE, this.onWaveComplete.bind(this));
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

  private onWaveComplete() {
    this.updateVariant();
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

    const params = this.getShotCurrentParams();
    const instantAttack = this.instantShot && this.shot instanceof ShotBallFire;
    const now = this.scene.getTime();
    const pause = instantAttack ? 0 : progressionQuadratic({
      defaultValue: DIFFICULTY.ASSISTANT_ATTACK_PAUSE,
      scale: DIFFICULTY.ASSISTANT_ATTACK_PAUSE_GROWTH,
      level: this.owner.upgradeLevel[PlayerSkill.ATTACK_SPEED],
    });

    this.shot.shoot(target, params);

    this.nextAttackTimestamp = now + Math.max(pause, 200);
    this.instantShot = !this.instantShot;
  }

  private getTarget(): Nullable<IEnemy> {
    const maxDistance = progressionQuadratic({
      defaultValue: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      scale: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
      level: this.owner.upgradeLevel[PlayerSkill.ATTACK_DISTANCE],
    });

    const enemies = this.scene.getEntities<IEnemy>(EntityType.ENEMY).filter((enemy) => {
      if (enemy.alpha < 1.0 || enemy.live.isDead()) {
        return false;
      }

      const positionFrom = this.getBottomFace();
      const positionTo = enemy.getBottomFace();

      return (
        getIsometricDistance(positionFrom, positionTo) <= maxDistance
        && !this.scene.level.hasTilesBetweenPositions(positionFrom, positionTo)
      );
    });

    return getClosestByIsometricDistance(enemies, this);
  }

  private updateVariant() {
    const variants = Object.values(AssistantVariant);
    const index = Math.min(
      variants.length - 1,
      Math.floor((this.scene.wave.number - 1) / DIFFICULTY.ASSISTANT_UNLOCK_PER_WAVE),
    );

    if (this.variant === variants[index]) {
      return;
    }

    const prevVariant = this.variant;

    this.variant = variants[index];

    if (prevVariant) {
      this.emit(AssistantEvents.UNLOCK_VARIANT, this.variant);
    }

    this.setWeapon(ASSISTANT_WEAPON[this.variant]);
    this.setTexture(AssistantTexture[this.variant]);
    this.anims.play(`idle.${this.texture.key}`);
  }

  private setWeapon(Shot: IShotFactory) {
    if (this.shot) {
      this.shot.destroy();
    }

    this.shot = new Shot(this.scene, {
      maxDistance: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      speed: DIFFICULTY.ASSISTANT_ATTACK_SPEED,
      damage: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE,
    }, {
      scale: 0.5,
    });

    this.shot.setInitiator(this, () => this.body.center);
    this.shotDefaultParams = this.shot.params;
  }

  private getShotCurrentParams() {
    const params: ShotParams = {
      speed: this.shotDefaultParams.speed,
      maxDistance:
        this.shotDefaultParams.maxDistance
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.maxDistance,
          scale: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
          level: this.owner.upgradeLevel[PlayerSkill.ATTACK_DISTANCE],
        }),
      damage:
        this.shotDefaultParams.damage
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.damage,
          scale: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_GROWTH,
          level: this.owner.upgradeLevel[PlayerSkill.ATTACK_DAMAGE],
        }),
    };

    return params;
  }

  private registerAnimations() {
    Object.values(AssistantTexture).forEach((texture) => {
      this.anims.create({
        key: `idle.${texture}`,
        frames: this.anims.generateFrameNumbers(texture, {}),
        frameRate: 4,
        repeat: -1,
        delay: Math.random() * 500,
      });
    });
  }
}

import { DIFFICULTY } from '~const/world/difficulty';
import { ASSISTANT_PATH_BREAKPOINT, ASSISTANT_TILE_SIZE } from '~const/world/entities/assistant';
import { NPC } from '~entity/npc';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { Assets } from '~lib/assets';
import { getClosest, getIsometricDistance } from '~lib/dimension';
import { progressionQuadratic } from '~lib/progression';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import {
  AssistantTexture,
  AssistantData,
  IAssistant,
} from '~type/world/entities/npc/assistant';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer, PlayerSkill } from '~type/world/entities/player';
import { IShot, ShotParams } from '~type/world/entities/shot';

Assets.RegisterSprites(AssistantTexture, ASSISTANT_TILE_SIZE);

export class Assistant extends NPC implements IAssistant {
  private shot: IShot;

  private owner: IPlayer;

  private shotDefaultParams: ShotParams;

  private nextAttackTimestamp: number = 0;

  constructor(scene: IWorld, {
    owner, positionAtMatrix, speed,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.ASSISTANT,
      positionAtMatrix,
      speed,
      pathFindTriggerDistance: ASSISTANT_PATH_BREAKPOINT,
      seesInvisibleTarget: true,
      body: {
        ...ASSISTANT_TILE_SIZE,
        type: 'circle',
      },
    });
    scene.add.existing(this);

    this.shot = new ShotBallFire(scene, {
      maxDistance: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      speed: DIFFICULTY.ASSISTANT_ATTACK_SPEED,
      damage: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE,
    }, {
      scale: 0.75,
    });
    this.shot.setInitiator(this, () => this.body.center);
    this.shotDefaultParams = this.shot.params;

    this.owner = owner;
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
    const pause = progressionQuadratic({
      defaultValue: DIFFICULTY.ASSISTANT_ATTACK_PAUSE,
      scale: DIFFICULTY.ASSISTANT_ATTACK_PAUSE_GROWTH,
      level: this.owner.upgradeLevel[PlayerSkill.ATTACK_SPEED],
    });

    this.nextAttackTimestamp = now + Math.max(pause, 200);
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

    return getClosest(enemies, this);
  }

  private getShotCurrentParams() {
    const params: ShotParams = {
      maxDistance:
        this.shotDefaultParams.maxDistance
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.maxDistance,
          scale: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
          level: this.owner.upgradeLevel[PlayerSkill.ATTACK_DISTANCE],
        }),
      speed:
        this.shotDefaultParams.speed
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.speed,
          scale: DIFFICULTY.ASSISTANT_ATTACK_SPEED_GROWTH,
          level: this.owner.upgradeLevel[PlayerSkill.ATTACK_SPEED],
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
}

import { DIFFICULTY } from '~const/world/difficulty';
import {
  ASSISTANT_PATH_BREAKPOINT,
  ASSISTANT_TILE_SIZE,
} from '~const/world/entities/assistant';
import { NPC } from '~entity/npc';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { registerSpriteAssets } from '~lib/assets';
import { progressionQuadratic } from '~lib/difficulty';
import { getClosest } from '~lib/utils';
import { Effect } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { EffectTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import {
  AssistantTexture,
  AssistantData,
  IAssistant,
} from '~type/world/entities/npc/assistant';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { IShot, ShotParams } from '~type/world/entities/shot';
import { WaveEvents } from '~type/world/wave';

export class Assistant extends NPC implements IAssistant {
  private shot: IShot;

  private owner: IPlayer;

  private shotDefaultParams: ShotParams;

  private nextAttackTimestamp: number = 0;

  public level: number = 1;

  constructor(scene: IWorld, {
    owner, positionAtMatrix, speed,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.ASSISTANT,
      positionAtMatrix,
      speed,
      pathFindTriggerDistance: ASSISTANT_PATH_BREAKPOINT,
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

    this.gamut = ASSISTANT_TILE_SIZE.gamut;
    this.owner = owner;

    this.body.setCircle(this.width / 2, 0, 1);

    this.handleWaveComplete();
    this.activate();

    this.addCollider(EntityType.ENEMY, 'collider', (enemy: IEnemy) => {
      enemy.attack(this);
    });

    this.addCollider(EntityType.ENEMY, 'overlap', (enemy: IEnemy) => {
      enemy.overlapTarget();
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
      level: this.level,
    });

    this.nextAttackTimestamp = now + Math.max(pause, 200);
  }

  private getTarget(): Nullable<IEnemy> {
    const maxDistance = progressionQuadratic({
      defaultValue: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      scale: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
      level: this.level,
    });

    const enemies = this.scene.getEntities<IEnemy>(EntityType.ENEMY).filter((enemy) => {
      if (enemy.alpha < 1.0 || enemy.live.isDead()) {
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
      maxDistance:
        this.shotDefaultParams.maxDistance
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.maxDistance,
          scale: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
          level: this.level,
        }),
      speed:
        this.shotDefaultParams.speed
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.speed,
          scale: DIFFICULTY.ASSISTANT_ATTACK_SPEED_GROWTH,
          level: this.level,
        }),
      damage:
        this.shotDefaultParams.damage
        && progressionQuadratic({
          defaultValue: this.shotDefaultParams.damage,
          scale: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_GROWTH,
          level: this.level,
        }),
    };

    return params;
  }

  private handleWaveComplete() {
    const handler = () => {
      this.live.heal();
    };

    this.scene.wave.on(WaveEvents.COMPLETE, handler);

    this.on(Phaser.Scenes.Events.DESTROY, () => {
      this.scene.wave.off(WaveEvents.COMPLETE, handler);
    });
  }
}

registerSpriteAssets(AssistantTexture, ASSISTANT_TILE_SIZE);

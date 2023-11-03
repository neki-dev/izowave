import { SHOT_BALL_DAMAGE_SPREAD_FACTOR, SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE } from '~const/world/entities/shot';
import { getIsometricDistance } from '~lib/dimension';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { ShotBallAudio, ShotData, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFire extends ShotBall {
  constructor(scene: IWorld, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.FIRE,
      color: 0xff5400,
      glow: true,
    });
  }

  public hit(target: IEnemy) {
    super.hit(target);

    this.scene.particles.createFireEffect(target);

    if (this.params.damage) {
      this.spreadDamage(target, this.params.damage * SHOT_BALL_DAMAGE_SPREAD_FACTOR);

      if (target.active) {
        target.live.damage(this.params.damage);
      }
    }
  }

  private spreadDamage(target: IEnemy, damage: number) {
    const position = target.getBottomFace();

    this.scene.getEntities<IEnemy>(EntityType.ENEMY).forEach((enemy) => {
      if (enemy.active && enemy !== target) {
        const distance = getIsometricDistance(position, enemy.getBottomFace());

        if (distance < SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE) {
          const damageByDistance = damage * (1 - (distance / SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE));

          enemy.live.damage(damageByDistance);
        }
      }
    });
  }
}

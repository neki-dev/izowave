import { ShotBall } from '..';
import type { ShotParams, ShotData } from '../../types';
import { SHOT_BALL_DAMAGE_SPREAD_FACTOR, SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE } from '../const';
import { ShotBallAudio } from '../types';

import { getIsometricDistance } from '~lib/dimension';
import type { IEnemy } from '~scene/world/entities/npc/enemy/types';
import { EntityType } from '~scene/world/entities/types';
import type { IWorld } from '~scene/world/types';

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

    this.scene.fx.createFireEffect(target);

    if (this.params.damage) {
      this.spreadDamage(target, this.params.damage * SHOT_BALL_DAMAGE_SPREAD_FACTOR);

      if (target.active) {
        target.live.damage(this.params.damage);
      }
    }
  }

  private spreadDamage(target: IEnemy, damage: number) {
    const position = target.getBottomEdgePosition();

    this.scene.getEntities<IEnemy>(EntityType.ENEMY).forEach((enemy) => {
      if (enemy.active && enemy !== target) {
        const distance = getIsometricDistance(position, enemy.getBottomEdgePosition());

        if (distance < SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE) {
          const damageByDistance = damage * (1 - (distance / SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE));

          enemy.live.damage(damageByDistance);
        }
      }
    });
  }
}

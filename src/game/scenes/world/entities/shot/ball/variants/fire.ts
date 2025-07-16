import { ShotBall } from '..';
import type { Enemy } from '../../../npc/enemy';
import type { ShotParams, ShotData } from '../../types';
import { SHOT_BALL_DAMAGE_SPREAD_FACTOR, SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE } from '../const';
import { ShotBallAudio } from '../types';

import { getIsometricDistance } from '~core/dimension';
import type { WorldScene } from '~scene/world';
import { EntityType } from '~scene/world/entities/types';

export class ShotBallFire extends ShotBall {
  constructor(scene: WorldScene, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.FIRE,
      color: 0xff5400,
      glow: true,
    });
  }

  public hit(target: Enemy) {
    super.hit(target);

    this.scene.fx.createFireEffect(target);

    if (this.params.damage) {
      this.spreadDamage(target, this.params.damage * SHOT_BALL_DAMAGE_SPREAD_FACTOR);

      if (target.active) {
        target.live.damage(this.params.damage);
      }
    }
  }

  private spreadDamage(target: Enemy, damage: number) {
    const position = target.getBottomEdgePosition();

    this.scene.getEntities<Enemy>(EntityType.ENEMY).forEach((enemy) => {
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

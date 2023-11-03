import { SHOT_BALL_DAMAGE_SPREAD_FACTOR, SHOT_BALL_DAMAGE_SPREAD_MAX_DISTANCE } from '~const/world/entities/shot';
import { getIsometricDistance } from '~lib/dimension';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
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

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      const lifespan = target.displayWidth * 5;
      const scale = Math.min(2.0, target.displayWidth / 22);

      new Particles(target, {
        key: 'fire-mini',
        texture: ParticlesTexture.BIT_SOFT,
        dynamic: true,
        params: {
          duration: lifespan,
          followOffset: target.getBodyOffset(),
          color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
          colorEase: 'quad.out',
          lifespan: { min: lifespan / 2, max: lifespan },
          scale: { start: scale, end: scale * 0.2 },
          alpha: { start: 1.0, end: 0.0 },
          speed: 80,
        },
      });
    }

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

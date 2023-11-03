import { Environment } from '~lib/environment';
import { Particles } from '~scene/world/effects';
import { GameSettings, GameFlag } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { ShotBallAudio, ShotData, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallSimple extends ShotBall {
  constructor(scene: IWorld, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.FIRE,
      color: 0xfff985,
    });
  }

  public hit(target: IEnemy) {
    super.hit(target);

    if (
      this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
      && Environment.GetFlag(GameFlag.BLOOD)
    ) {
      const scale = Math.min(2.0, target.displayWidth / 22);

      new Particles(target, {
        key: 'blood',
        texture: ParticlesTexture.BIT_SOFT,
        dynamic: true,
        params: {
          duration: 200,
          followOffset: target.getBodyOffset(),
          lifespan: { min: 100, max: 250 },
          scale: { start: scale, end: scale * 0.25 },
          speed: 60,
          maxAliveParticles: 6,
          tint: 0xdd1e1e,
        },
      });
    }

    if (this.params.damage) {
      target.live.damage(this.params.damage);
    }
  }
}

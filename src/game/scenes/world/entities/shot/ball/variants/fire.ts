import { World } from '~scene/world/world';
import { ShotBallAudio, ShotBallTexture, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFire extends ShotBall {
  constructor(scene: World, params: ShotParams) {
    super(scene, params, {
      texture: ShotBallTexture.FIRE,
      audio: ShotBallAudio.FIRE,
      glowColor: 0xff5400,
    });
  }
}

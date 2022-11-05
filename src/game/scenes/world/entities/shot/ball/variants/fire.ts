import { ShotBallAudio, ShotBallTexture, ShotParent } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFire extends ShotBall {
  constructor(parent: ShotParent) {
    super(parent, {
      texture: ShotBallTexture.FIRE,
      audio: ShotBallAudio.FIRE,
      glowColor: 0xff5400,
    });
  }
}

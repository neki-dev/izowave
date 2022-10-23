import { ShotBallAudio, ShotBallTexture, ShotParent } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFrozen extends ShotBall {
  constructor(parent: ShotParent) {
    super(parent, {
      texture: ShotBallTexture.FROZEN,
      audio: ShotBallAudio.FROZEN,
      glowColor: 0x00a1ff,
    });
  }
}

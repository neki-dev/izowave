import { World } from '~scene/world/world';
import { ShotBallAudio, ShotBallTexture, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFrozen extends ShotBall {
  constructor(scene: World, params: ShotParams) {
    super(scene, params, {
      texture: ShotBallTexture.FROZEN,
      audio: ShotBallAudio.FROZEN,
      glowColor: 0x00a1ff,
    });
  }
}

import { IWorld } from '~type/world';
import { ShotBallAudio, ShotBallTexture, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFrozen extends ShotBall {
  constructor(scene: IWorld, params: ShotParams) {
    super(scene, params, {
      texture: ShotBallTexture.FROZEN,
      audio: ShotBallAudio.FROZEN,
      glowColor: 0x00a1ff,
    });
  }
}

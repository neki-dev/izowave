import { IWorld } from '~type/world';
import { ShotBallAudio, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFrozen extends ShotBall {
  constructor(scene: IWorld, params: ShotParams) {
    super(scene, params, {
      audio: ShotBallAudio.FROZEN,
      color: 0x00a1ff,
      glow: true,
    });
  }
}

import { IWorld } from '~type/world';
import { ShotBallAudio, ShotData, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallFrozen extends ShotBall {
  constructor(scene: IWorld, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.FROZEN,
      color: 0x00a1ff,
      glow: true,
    });
  }
}

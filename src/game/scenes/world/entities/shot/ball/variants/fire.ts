import { IWorld } from '~type/world';
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
}

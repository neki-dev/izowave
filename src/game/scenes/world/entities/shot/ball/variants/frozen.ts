import { ShotBall } from '..';
import type { ShotParams, ShotData } from '../../types';
import { ShotBallAudio } from '../types';

import type { IEnemy } from '~scene/world/entities/npc/enemy/types';
import type { IWorld } from '~scene/world/types';

export class ShotBallFrozen extends ShotBall {
  constructor(scene: IWorld, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.FROZEN,
      color: 0x00a1ff,
      glow: true,
    });
  }

  public hit(target: IEnemy) {
    super.hit(target);

    const duration = this.params.freeze;

    if (duration && target.live.armour <= 0) {
      target.freeze(duration, true);
    }
  }
}

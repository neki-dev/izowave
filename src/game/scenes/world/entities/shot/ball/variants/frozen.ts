import { ShotParams, ShotData, ShotBallAudio } from '../../types';
import type { IEnemy } from '~scene/world/entities/npc/enemy/types';
import type { IWorld } from '~scene/world/types';

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

  public hit(target: IEnemy) {
    super.hit(target);

    if (this.params.freeze && target.live.armour <= 0) {
      target.freeze(this.params.freeze, true);
    }
  }
}

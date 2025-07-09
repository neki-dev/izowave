import { ShotBall } from '..';
import type { Enemy } from '../../../npc/enemy';
import type { ShotParams, ShotData } from '../../types';
import { ShotBallAudio } from '../types';

import type { WorldScene } from '~scene/world';

export class ShotBallSimple extends ShotBall {
  constructor(scene: WorldScene, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.SIMPLE,
      color: 0xfff985,
    });
  }

  public hit(target: Enemy) {
    super.hit(target);

    this.scene.fx.createBloodEffect(target);

    if (this.params.damage) {
      target.live.damage(this.params.damage);
    }
  }
}

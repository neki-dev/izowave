import { IWorld } from '~type/world';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { ShotBallAudio, ShotData, ShotParams } from '~type/world/entities/shot';

import { ShotBall } from '../ball';

export class ShotBallSimple extends ShotBall {
  constructor(scene: IWorld, params: ShotParams, data: ShotData = {}) {
    super(scene, params, {
      ...data,
      audio: ShotBallAudio.FIRE,
      color: 0xfff985,
    });
  }

  public hit(target: IEnemy) {
    super.hit(target);

    this.scene.particles.createBloodEffect(target);

    if (this.params.damage) {
      target.live.damage(this.params.damage);
    }
  }
}

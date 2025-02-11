import { Enemy } from '..';
import { EnemyTexture, EnemyAudio } from '../types';
import type { EnemyVariantData } from '../types';

import type { IWorld } from '~scene/world/types';

export class EnemyBoss extends Enemy {
  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      score: 10,
      multipliers: {
        health: 8.0,
        damage: 1.0,
        speed: 0.5,
        might: 5.0,
      },
    });
  }

  protected onDead() {
    this.scene.fx.playSound(EnemyAudio.ROAR);
    super.onDead();
  }
}

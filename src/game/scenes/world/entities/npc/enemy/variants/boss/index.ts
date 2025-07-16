import { Enemy } from '../..';
import type { EnemyVariantData } from '../../types';
import { EnemyTexture, EnemyAudio } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemyBoss extends Enemy {
  constructor(scene: WorldScene, data: EnemyVariantData) {
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

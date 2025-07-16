import { Enemy } from '../..';
import type { EnemyVariantData } from '../../types';
import { EnemyTexture } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemySpike extends Enemy {
  static SpawnWaveRange = [2, 7];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.SPIKE,
      multipliers: {
        health: 1.1,
        damage: 0.4,
        speed: 0.8,
        might: 0.7,
      },
    });
  }
}

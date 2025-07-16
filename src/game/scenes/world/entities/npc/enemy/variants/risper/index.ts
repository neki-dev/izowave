import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemyRisper extends Enemy {
  static SpawnWaveRange = [3, 9];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.RISPER,
      multipliers: {
        health: 0.9,
        damage: 0.5,
        speed: 1.1,
        might: 0.8,
      },
    });
  }
}

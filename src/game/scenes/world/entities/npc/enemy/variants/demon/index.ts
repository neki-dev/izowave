import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemyDemon extends Enemy {
  static SpawnWaveRange = [1, 5];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.DEMON,
      multipliers: {
        health: 0.6,
        damage: 0.3,
        speed: 0.8,
        might: 0.5,
      },
    });
  }
}

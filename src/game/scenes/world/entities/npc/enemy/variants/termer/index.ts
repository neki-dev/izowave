import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemyTermer extends Enemy {
  static SpawnWaveRange = [18];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.TERMER,
      multipliers: {
        health: 2.6,
        damage: 1.0,
        speed: 0.8,
        might: 1.4,
      },
    });
  }
}

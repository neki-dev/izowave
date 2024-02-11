import { Enemy } from '..';
import type { IWorld } from '~scene/world/types';

import { EnemyVariantData, EnemyTexture } from '../types';

export class EnemyTermer extends Enemy {
  static SpawnWaveRange = [18];

  constructor(scene: IWorld, data: EnemyVariantData) {
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

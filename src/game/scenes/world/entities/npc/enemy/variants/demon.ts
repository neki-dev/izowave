import { Enemy } from '..';
import type { IWorld } from '~scene/world/types';

import type { EnemyVariantData } from '../types';
import { EnemyTexture } from '../types';

export class EnemyDemon extends Enemy {
  static SpawnWaveRange = [1, 5];

  constructor(scene: IWorld, data: EnemyVariantData) {
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

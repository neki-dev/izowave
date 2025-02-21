import { Enemy } from '..';
import { EnemyTexture } from '../types';
import type { EnemyVariantData } from '../types';

import type { IWorld } from '~scene/world/types';

export class EnemyUndead extends Enemy {
  static SpawnWaveRange = [4, 9];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.UNDEAD,
      multipliers: {
        health: 1.5,
        damage: 0.5,
        speed: 0.7,
        might: 0.9,
      },
    });
  }
}

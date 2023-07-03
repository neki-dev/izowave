import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyJellyfish extends Enemy {
  static SpawnMinWave = 2;

  static SpawnFrequency = 2;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.JELLYFISH,
      scale: 1.0,
      multipliers: {
        health: 0.4,
        damage: 0.3,
        speed: 0.5,
      },
    });
  }
}

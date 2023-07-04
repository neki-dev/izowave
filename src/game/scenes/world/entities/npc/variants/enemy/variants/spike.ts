import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemySpike extends Enemy {
  static SpawnMinWave = 3;

  static SpawnFrequency = 3;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.SPIKE,
      multipliers: {
        health: 0.7,
        damage: 0.3,
        speed: 0.4,
      },
    });
  }
}

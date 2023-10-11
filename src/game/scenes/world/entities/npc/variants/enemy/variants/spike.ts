import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemySpike extends Enemy {
  static SpawnWaveRange = [3, 8];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.SPIKE,
      multipliers: {
        health: 0.7,
        damage: 0.4,
        speed: 0.8,
      },
    });
  }
}

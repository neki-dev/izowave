import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyOverlord extends Enemy {
  static SpawnMinWave = 3;

  static SpawnFrequency = 3;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.OVERLORD,
      multipliers: {
        health: 0.9,
        damage: 0.4,
        speed: 0.43,
      },
    });
  }
}

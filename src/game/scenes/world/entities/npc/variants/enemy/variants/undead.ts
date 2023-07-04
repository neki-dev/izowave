import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyUndead extends Enemy {
  static SpawnMinWave = 7;

  static SpawnFrequency = 2;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.UNDEAD,
      multipliers: {
        health: 1.6,
        damage: 0.2,
        speed: 0.35,
      },
    });
  }
}

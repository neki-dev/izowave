import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyDemon extends Enemy {
  static SpawnMinWave = 2;

  static SpawnFrequency = 3;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.DEMON,
      multipliers: {
        health: 0.4,
        damage: 0.2,
        speed: 0.4,
      },
    });
  }
}

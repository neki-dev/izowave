import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyDemon extends Enemy {
  static SpawnMinWave = 3;

  static SpawnFrequency = 5;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.DEMON,
      scale: 1.5,
      multipliers: {
        health: 0.7,
        damage: 0.2,
        speed: 0.4,
      },
    });
  }
}

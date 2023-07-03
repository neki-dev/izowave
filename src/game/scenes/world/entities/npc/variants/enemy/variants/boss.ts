import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBoss extends Enemy {
  static SpawnMinWave = 5;

  static SpawnFrequency = 0;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      scale: 2.0,
      multipliers: {
        health: 6.0,
        damage: 0.9,
        speed: 0.24,
      },
    });
  }
}

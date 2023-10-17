import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

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
      },
    });
  }
}

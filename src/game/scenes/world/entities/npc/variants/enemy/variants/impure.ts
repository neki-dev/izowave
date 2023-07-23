import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyImpure extends Enemy {
  static SpawnWaveRange = [8];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.IMPURE,
      multipliers: {
        health: 1.3,
        damage: 0.6,
        speed: 0.9,
      },
    });
  }
}

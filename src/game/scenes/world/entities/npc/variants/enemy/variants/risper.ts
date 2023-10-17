import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyRisper extends Enemy {
  static SpawnWaveRange = [3, 9];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.RISPER,
      multipliers: {
        health: 0.9,
        damage: 0.5,
        speed: 1.1,
      },
    });
  }
}

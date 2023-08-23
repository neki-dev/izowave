import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyRisper extends Enemy {
  static SpawnWaveRange = [4, 9];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.RISPER,
      multipliers: {
        health: 0.7,
        damage: 0.5,
        speed: 1.0,
      },
    });
  }
}

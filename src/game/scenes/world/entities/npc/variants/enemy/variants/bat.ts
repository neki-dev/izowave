import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBat extends Enemy {
  static SpawnWaveRange = [1, 4];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BAT,
      multipliers: {
        health: 0.35,
        damage: 0.1,
        speed: 0.5,
      },
    });
  }
}

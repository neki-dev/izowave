import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBoss extends Enemy {
  static SpawnWaveRange = [5];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      multipliers: {
        health: 5.5,
        damage: 0.9,
        speed: 0.24,
      },
    });
  }
}

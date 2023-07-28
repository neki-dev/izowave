import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyOverlord extends Enemy {
  static SpawnWaveRange = [6];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.OVERLORD,
      multipliers: {
        health: 1.0,
        damage: 0.5,
        speed: 0.8,
      },
    });
  }
}

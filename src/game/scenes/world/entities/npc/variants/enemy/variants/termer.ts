import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyTermer extends Enemy {
  static SpawnWaveRange = [18];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.TERMER,
      multipliers: {
        health: 2.7,
        damage: 1.0,
        speed: 0.8,
      },
    });
  }
}

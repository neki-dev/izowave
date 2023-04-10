import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBouche extends Enemy {
  static SpawnMinWave = 11;

  static SpawnFrequency = 2;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOUCHE,
      scale: 1.5,
      multipliers: {
        health: 2.0,
        damage: 0.6,
        speed: 0.32,
      },
    });
  }
}

import { Enemy } from '..';
import { EnemyTexture } from '../types';
import type { EnemyVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

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
        might: 0.8,
      },
    });
  }
}

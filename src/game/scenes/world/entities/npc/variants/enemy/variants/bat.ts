import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBat extends Enemy {
  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BAT,
      health: 35,
      damage: 10,
      speed: 50,
      experienceMultiply: 0.5,
      scale: 1.5,
    });
  }
}

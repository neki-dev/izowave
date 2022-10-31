import { World } from '~scene/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/enemy';

import { Enemy } from '../enemy';

export class EnemyBoss extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      health: 600,
      damage: 90,
      speed: 24,
      experienceMultiply: 10.0,
      scale: 2.0,
    });
  }
}

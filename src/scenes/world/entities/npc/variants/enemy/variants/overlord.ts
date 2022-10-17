import { World } from '~scene/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/enemy';

import { Enemy } from '../enemy';

export class EnemyOverlord extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.OVERLORD,
      health: 90,
      damage: 40,
      speed: 43,
    });
  }
}

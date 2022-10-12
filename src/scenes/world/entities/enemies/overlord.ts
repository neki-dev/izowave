import { World } from '~scene/world';
import { Enemy } from '~scene/world/entities/enemy';
import { EnemyVariantData, EnemyTexture } from '~type/enemy';

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

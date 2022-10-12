import { World } from '~scene/world';
import { Enemy } from '~scene/world/entities/enemy';
import { EnemyVariantData, EnemyTexture } from '~type/enemy';

export class EnemyDemon extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.DEMON,
      health: 70,
      damage: 20,
      speed: 40,
      scale: 1.5,
    });
  }
}

import { World } from '~scene/world';
import { Enemy } from '~scene/world/entities/enemy';
import { EnemyVariantData, EnemyTexture } from '~type/enemy';

export class EnemyBouche extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOUCHE,
      health: 200,
      damage: 60,
      speed: 32,
      scale: 1.5,
    });
  }
}

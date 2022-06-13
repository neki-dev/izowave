import Enemy from '~scene/world/entities/enemy';
import World from '~scene/world';

import { EnemyVariantData, EnemyTexture } from '~type/enemy';

export default class EnemyImpure extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.IMPURE,
      health: 130,
      damage: 60,
      speed: 45,
      scale: 1.35,
    });
  }
}

import Enemy from '~scene/world/entities/enemy';
import World from '~scene/world';

import { EnemyVariantData, EnemyTexture } from '~type/enemy';

export default class EnemyDemon extends Enemy {
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

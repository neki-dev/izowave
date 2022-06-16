import Enemy from '~scene/world/entities/enemy';
import World from '~scene/world';

import { EnemyVariantData, EnemyTexture } from '~type/enemy';

export default class EnemyBoss extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      health: 700,
      damage: 90,
      speed: 24,
      experienceMultiply: 10.0,
      scale: 2.0,
    });
  }
}

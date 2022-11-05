import { World } from '~game/scenes/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

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

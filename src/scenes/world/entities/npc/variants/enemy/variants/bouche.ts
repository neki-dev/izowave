import { World } from '~scene/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

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

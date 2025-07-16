import { Enemy } from '../..';
import type { EnemyVariantData } from '../../types';
import { EnemyTexture } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemyAdherent extends Enemy {
  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.ADHERENT,
      multipliers: {
        health: 0.7,
        damage: 0.3,
        speed: 0.9,
        might: 0.5,
      },
    });
  }
}

import { Enemy } from '..';
import { EnemyTexture } from '../types';
import type { EnemyVariantData } from '../types';

import type { IWorld } from '~scene/world/types';

export class EnemyAdherent extends Enemy {
  constructor(scene: IWorld, data: EnemyVariantData) {
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

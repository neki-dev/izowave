import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

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

import { Enemy } from '../..';
import { EnemyFactory } from '../../factory';
import { EnemyTexture, EnemyVariant } from '../../types';
import type { EnemyVariantData } from '../../types';

import type { WorldScene } from '~scene/world';

export class EnemyStranger extends Enemy {
  static SpawnWaveRange = [11];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.STRANGER,
      multipliers: {
        health: 1.5,
        damage: 0.8,
        speed: 0.7,
        might: 1.0,
      },
    });
  }

  protected onDead() {
    this.spawnAdherents();
    super.onDead();
  }

  private spawnAdherents() {
    const offsets = [
      { x: 0, y: -10 },
      { x: 5, y: 5 },
      { x: -5, y: 5 },
    ];

    offsets.forEach((offset) => {
      EnemyFactory.create(this.scene, EnemyVariant.ADHERENT, {
        positionAtWorld: {
          x: this.x + offset.x,
          y: this.y + offset.y,
        },
      });
    });
  }
}

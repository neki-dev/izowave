import { ENEMIES } from '~const/world/entities/enemies';
import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture, EnemyVariant } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyStranger extends Enemy {
  static SpawnWaveRange = [11];

  constructor(scene: IWorld, data: EnemyVariantData) {
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

  public onDead() {
    this.spawnAdherents();
    super.onDead();
  }

  private spawnAdherents() {
    const EnemyInstance = ENEMIES[EnemyVariant.ADHERENT];
    const offsets = [
      { x: 0, y: -10 },
      { x: 5, y: 5 },
      { x: -5, y: 5 },
    ];

    offsets.forEach((offset) => {
      new EnemyInstance(this.scene, {
        positionAtWorld: {
          x: this.x + offset.x,
          y: this.y + offset.y,
        },
      });
    });
  }
}

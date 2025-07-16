import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import type { WorldScene } from '~scene/world';
import { BuildingVariant } from '~scene/world/entities/building/types';

export class EnemyGhost extends Enemy {
  static SpawnWaveRange = [8];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.GHOST,
      multipliers: {
        health: 1.5,
        damage: 0.7,
        speed: 0.8,
        might: 1.5,
      },
    });

    this.setAlpha(0.5);
  }

  public update() {
    super.update();

    try {
      this.updateVisible();
    } catch (error) {
      console.warn('Failed to update ghost enemy', error as TypeError);
    }
  }

  private updateVisible() {
    const isVisible = this.scene.builder
      .getBuildingsByVariant(BuildingVariant.RADAR)
      .some((building) => building.actionsAreaContains(this));

    this.setAlpha(isVisible ? 1.0 : 0.5);
  }
}

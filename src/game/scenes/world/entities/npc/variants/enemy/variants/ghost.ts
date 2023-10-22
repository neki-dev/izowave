import { IWorld } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyGhost extends Enemy {
  static SpawnWaveRange = [8];

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.GHOST,
      multipliers: {
        health: 1.5,
        damage: 0.7,
        speed: 0.8,
      },
    });

    this.setAlpha(0.5);
  }

  public update() {
    super.update();

    const isVisible = this.scene.builder
      .getBuildingsByVariant(BuildingVariant.RADAR)
      .some((building) => building.actionsAreaContains(this));

    this.setAlpha(isVisible ? 1.0 : 0.5);
  }
}

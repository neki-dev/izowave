import { DIFFICULTY } from '~const/world/difficulty';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import {
  BuildingEvents, BuildingVariant, BuildingTexture, BuildingParamItem, BuildingVariantData,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingWall extends Building {
  static Name = 'Wall';

  static Description = 'Wall with more health to defend other buildings';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_WALL_HEALTH, icon: ScreenIcon.HEALTH },
  ];

  static Texture = BuildingTexture.WALL;

  static Cost = DIFFICULTY.BUILDING_WALL_COST;

  static Health = DIFFICULTY.BUILDING_WALL_HEALTH;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.WALL,
      health: BuildingWall.Health,
      texture: BuildingWall.Texture,
    });

    this.on(BuildingEvents.UPGRADE, this.upgradeHealth, this);
  }

  /**
   * Update max health by upgrade level.
   */
  private upgradeHealth() {
    const health = DIFFICULTY.BUILDING_WALL_HEALTH + (DIFFICULTY.BUILDING_WALL_HEALTH_UPGRADE * (this.upgradeLevel - 1));

    this.live.setMaxHealth(health);
  }
}

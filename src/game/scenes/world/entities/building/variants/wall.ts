import { DIFFICULTY } from '~const/world/difficulty';
import { progressionLinear } from '~lib/difficulty';
import { IWorld } from '~type/world';
import {
  BuildingEvents, BuildingVariant, BuildingTexture, BuildingParam, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingWall extends Building {
  static Name = 'Wall';

  static Description = 'Defends other buildings';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_WALL_HEALTH, icon: BuildingIcon.HEALTH },
  ];

  static Texture = BuildingTexture.WALL;

  static Cost = DIFFICULTY.BUILDING_WALL_COST;

  static Health = DIFFICULTY.BUILDING_WALL_HEALTH;

  static AllowByWave = DIFFICULTY.BUILDING_WALL_ALLOW_BY_WAVE;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.WALL,
      health: BuildingWall.Health,
      texture: BuildingWall.Texture,
    });

    this.on(BuildingEvents.UPGRADE, this.onUpgrade.bind(this));
  }

  private onUpgrade() {
    const health = progressionLinear({
      defaultValue: DIFFICULTY.BUILDING_WALL_HEALTH,
      scale: DIFFICULTY.BUILDING_WALL_HEALTH_GROWTH,
      level: this.upgradeLevel,
    });

    this.live.setMaxHealth(health);
  }
}

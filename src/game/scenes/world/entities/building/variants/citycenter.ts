import { Building } from '..';
import { BuildingTower } from './tower';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { ShotBallFire } from '~scene/world/entities/shot/ball/variants/fire';
import { BuildingIcon } from '../types';
import { BuildingParam } from '../types';
import { LEVEL_MAP_PERSPECTIVE } from '~scene/world/level/const';

export class BuildingCityCenter extends BuildingTower {
  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Radius = DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS;

  static Limit = true;

  static MaxLevel = 4;

  static CityRequired = false;

  private buildActionRadius: Phaser.GameObjects.Ellipse;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
        damage: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE,
        speed: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED,
      });

    super(scene, {
      ...data,
      variant: BuildingVariant.CITYCENTER,
      health: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH,
      texture: BuildingCityCenter.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY_GROWTH,
      },
    }, shot);

    if (Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR)) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR);
    } else if (
      Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR_SECOND)
      && this.scene.builder.getBuildingsByVariant(BuildingVariant.GENERATOR).length > 0
    ) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR_SECOND);
      Tutorial.Start(TutorialStep.UPGRADE_BUILDING);
    }

    let radius = BuildingCityCenter.Radius;
    const d = radius * 2;

    this.buildActionRadius = this.scene.add.ellipse(0, 0, d, d * LEVEL_MAP_PERSPECTIVE);
    this.buildActionRadius.setFillStyle(0xffffff, 0.2);
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_POPULATION',
      icon: BuildingIcon.POWER,
      value: `${this.getCity().getPopulation()}/${this.getCity().getMaxPopulation()}`,      
    }];

    return info.concat(super.getInfo());
  }

  public update() {
    super.update();

    try {
      if (this.isActionAllowed()) {
        this.generateResource();
        this.pauseActions();
      }
    } catch (error) {
      console.warn('Failed to update generator generator', error as TypeError);
    }
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y += (this.upgradeLevel === 1) ? 5 : -4;

    return position;
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.scene.fx.createGenerationEffect(this);

    this.getCity().growPopulation();
  }
}

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

export class BuildingCityCenter extends BuildingTower {
  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.GENERATOR;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Radius = DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS;

  static Limit = true;

  static MaxLevel = 4;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
        damage: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE,
        speed: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED,
      });

    super(scene, {
      ...data,
      variant: BuildingVariant.CITYCENTER,
      health: DIFFICULTY.BUILDING_GENERATOR_HEALTH,
      texture: BuildingCityCenter.Texture,
      delay: {
        default: DIFFICULTY.BUILDING_GENERATOR_DELAY,
        growth: DIFFICULTY.BUILDING_GENERATOR_DELAY_GROWTH,
      },
    });

    if (Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR)) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR);
    } else if (
      Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR_SECOND)
      && this.scene.builder.getBuildingsByVariant(BuildingVariant.GENERATOR).length > 0
    ) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR_SECOND);
      Tutorial.Start(TutorialStep.UPGRADE_BUILDING);
    }
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
  }
}

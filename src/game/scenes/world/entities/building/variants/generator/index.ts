import { Building } from '../..';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../types';
import type { BuildingVariantData } from '../../types';

import { BUILDING_GENERATOR_COST, BUILDING_GENERATOR_DELAY, BUILDING_GENERATOR_DELAY_GROWTH, BUILDING_GENERATOR_HEALTH } from './const';

import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import type { WorldScene } from '~scene/world';

export class BuildingGenerator extends Building {
  static Category = BuildingCategory.RESOURCES;

  static Texture = BuildingTexture.GENERATOR;

  static Cost = BUILDING_GENERATOR_COST;

  static Limit = true;

  static MaxLevel = 4;

  constructor(scene: WorldScene, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.GENERATOR,
      health: BUILDING_GENERATOR_HEALTH,
      texture: BuildingGenerator.Texture,
      delay: {
        default: BUILDING_GENERATOR_DELAY,
        growth: BUILDING_GENERATOR_DELAY_GROWTH,
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

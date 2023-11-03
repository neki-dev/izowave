import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { Tutorial } from '~lib/tutorial';
import { LangPhrase } from '~type/lang';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import {
  BuildingTexture,
  BuildingVariant,
  BuildingVariantData,
  BuildingCategory,
} from '~type/world/entities/building';

export class BuildingGenerator extends Building {
  static Name: LangPhrase = 'BUILDING_NAME_GENERATOR';

  static Description: LangPhrase = 'BUILDING_DESCRIPTION_GENERATOR';

  static Category = BuildingCategory.RESOURCES;

  static Texture = BuildingTexture.GENERATOR;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Limit = true;

  static MaxLevel = 4;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.GENERATOR,
      health: DIFFICULTY.BUILDING_GENERATOR_HEALTH,
      texture: BuildingGenerator.Texture,
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

    if (!this.isActionAllowed()) {
      return;
    }

    this.generateResource();
    this.pauseActions();
  }

  public getTopFace() {
    const position = super.getTopFace();

    position.y += (this.upgradeLevel === 1) ? 5 : -4;

    return position;
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.scene.particles.createGenerationEffect(this);
  }
}

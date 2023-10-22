import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { Tutorial } from '~lib/tutorial';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { LangPhrase } from '~type/lang';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
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
    } else if (Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR_SECOND)) {
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

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Particles(this, {
        key: 'generate',
        texture: ParticlesTexture.BIT,
        position: this.getTopFace(),
        params: {
          duration: 300,
          lifespan: { min: 100, max: 200 },
          scale: { start: 1.0, end: 0.5 },
          alpha: { start: 1.0, end: 0.0 },
          speed: 60,
          maxAliveParticles: 8,
          tint: 0x2dffb2,
        },
      });
    }
  }
}

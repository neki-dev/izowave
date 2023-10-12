import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { Tutorial } from '~lib/tutorial';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import {
  BuildingParam, BuildingTexture, BuildingVariant, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

export class BuildingGenerator extends Building {
  static Name = 'Generator';

  static Description = 'Generates resources for builds and upgrades';

  static Category = 'Resources';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_GENERATOR_HEALTH, icon: BuildingIcon.HEALTH },
  ];

  static Texture = BuildingTexture.GENERATOR;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Health = DIFFICULTY.BUILDING_GENERATOR_HEALTH;

  static Limit = true;

  static MaxLevel = 4;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.GENERATOR,
      health: BuildingGenerator.Health,
      texture: BuildingGenerator.Texture,
      delay: {
        default: DIFFICULTY.BUILDING_GENERATOR_DELAY,
        growth: DIFFICULTY.BUILDING_GENERATOR_DELAY_GROWTH,
      },
    });

    if (Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR)) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR);
      if (this.scene.game.device.os.desktop) {
        Tutorial.Start(TutorialStep.STOP_BUILD);
      }
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

  public getTopCenterByLevel() {
    return {
      x: this.x,
      y: this.y - 6 + (this.upgradeLevel === 1 ? 10 : 0),
    };
  }

  private generateResource() {
    this.scene.player.giveResources(1);

    if (!this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      return;
    }

    new Particles(this, {
      key: 'generate',
      texture: ParticlesTexture.BIT,
      positionAtWorld: this.getTopCenterByLevel(),
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

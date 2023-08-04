import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { TutorialStep, TutorialStepState } from '~type/tutorial';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import {
  BuildingParam, BuildingTexture, BuildingVariant, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

export class BuildingGenerator extends Building {
  static Name = 'Generator';

  static Description = 'Generates resources for builds and upgrades';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_GENERATOR_HEALTH, icon: BuildingIcon.HEALTH },
  ];

  static Texture = BuildingTexture.GENERATOR;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Health = DIFFICULTY.BUILDING_GENERATOR_HEALTH;

  static Limit = true;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.GENERATOR,
      health: BuildingGenerator.Health,
      texture: BuildingGenerator.Texture,
      actions: {
        pause: DIFFICULTY.BUILDING_GENERATOR_GENERATE_PAUSE,
      },
    });

    if (this.scene.game.tutorial.state(TutorialStep.BUILD_GENERATOR) === TutorialStepState.IN_PROGRESS) {
      this.scene.game.tutorial.complete(TutorialStep.BUILD_GENERATOR);
      this.scene.game.tutorial.start(TutorialStep.STOP_BUILD);
    }
  }

  public getInfo() {
    const pause = this.getActionsPause();
    const info: BuildingParam[] = [{
      label: 'Delay',
      icon: BuildingIcon.PAUSE,
      value: `${pause / 1000} s`,
    }];

    return super.getInfo().concat(info);
  }

  public update() {
    super.update();

    if (!this.isActionAllowed()) {
      return;
    }

    this.generateResource();
    this.pauseActions();
  }

  private generateResource() {
    this.scene.player.giveResources(1);

    if (!this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      return;
    }

    const offsetByLevel = (3 - Math.min(this.upgradeLevel, 3)) * 8;

    new Particles(this, {
      key: 'generate',
      texture: ParticlesTexture.GLOW,
      positionAtWorld: {
        x: this.x,
        y: this.y + offsetByLevel - 6,
      },
      params: {
        duration: 300,
        lifespan: { min: 100, max: 200 },
        scale: { start: 0.2, end: 0.05 },
        speed: 60,
        maxAliveParticles: 6,
        tint: 0x2dffb2,
        blendMode: 'ADD',
      },
    });
  }
}

import { DIFFICULTY } from '~const/world/difficulty';
import { Building } from '~entity/building';
import { progressionLinearFrom } from '~lib/utils';
import { Particles } from '~scene/world/effects';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import {
  BuildingAudio, BuildingParam, BuildingEvents, BuildingTexture, BuildingVariant, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

export class BuildingGenerator extends Building {
  static Name = 'Generator';

  static Description = 'Resource generation for builds and upgrades';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_GENERATOR_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'RESOURCES', value: DIFFICULTY.BUILDING_GENERATOR_RESOURCES, icon: BuildingIcon.RESOURCES },
  ];

  static Texture = BuildingTexture.GENERATOR;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Health = DIFFICULTY.BUILDING_GENERATOR_HEALTH;

  static Limit = DIFFICULTY.BUILDING_GENERATOR_LIMIT;

  private resources: number = DIFFICULTY.BUILDING_GENERATOR_RESOURCES;

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

    this.on(BuildingEvents.UPGRADE, () => {
      this.upgradeAmount();
    });
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'RESOURCES',
      icon: BuildingIcon.RESOURCES,
      value: this.resources,
    }];

    return super.getInfo().concat(info);
  }

  public update() {
    super.update();

    if (!this.isActionAllowed()) {
      return;
    }

    this.generateResource();

    if (this.resources === 0) {
      this.scene.game.sound.play(BuildingAudio.OVER);

      this.destroy();
    } else {
      this.pauseActions();
    }
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.resources--;

    if (
      !this.visible
      || !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
    ) {
      return;
    }

    new Particles(this, {
      key: 'generate',
      texture: ParticlesTexture.BIT,
      positionAtWorld: {
        x: this.x,
        // TODO: Fix position
        y: this.y + 10 - (this.upgradeLevel * 2.5),
      },
      params: {
        duration: 200,
        lifespan: { min: 100, max: 200 },
        scale: { start: 1.0, end: 0.5 },
        speed: 50,
        maxAliveParticles: 6,
        tint: 0x2dffb2,
      },
    });
  }

  private upgradeAmount() {
    this.resources = progressionLinearFrom(
      this.resources,
      DIFFICULTY.BUILDING_GENERATOR_RESOURCES,
      DIFFICULTY.BUILDING_GENERATOR_RESOURCES_GROWTH,
      this.upgradeLevel,
    );
  }
}

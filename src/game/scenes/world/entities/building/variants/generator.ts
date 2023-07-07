import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_RESOURCES_LEFT_ALERT } from '~const/world/entities/building';
import { Building } from '~entity/building';
import { progressionLinearFrom } from '~lib/utils';
import { Particles } from '~scene/world/effects';
import { IWorld } from '~type/world';
import { ParticlesType } from '~type/world/effects';
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
      attention: (this.resources < BUILDING_RESOURCES_LEFT_ALERT),
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

      if (this.resources === BUILDING_RESOURCES_LEFT_ALERT) {
        this.hasAlert = true;
      }
    }
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.resources--;

    if (this.visible) {
      new Particles(this, {
        type: ParticlesType.BIT,
        positionAtWorld: {
          x: this.x,
          y: this.y + 10 - (this.upgradeLevel * 2.5),
        },
        duration: 300,
        params: {
          lifespan: { min: 100, max: 200 },
          scale: { start: 1.0, end: 0.5 },
          speed: 70,
          maxParticles: 6,
          tint: 0x2dffb2,
        },
      });
    }
  }

  private upgradeAmount() {
    this.hasAlert = false;
    this.resources = progressionLinearFrom(
      this.resources,
      DIFFICULTY.BUILDING_GENERATOR_RESOURCES,
      DIFFICULTY.BUILDING_GENERATOR_RESOURCES_GROWTH,
      this.upgradeLevel,
    );
  }
}

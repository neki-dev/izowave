import { BUILDING_RESOUCES_LEFT_ALERT } from '~const/building';
import { DIFFICULTY } from '~const/difficulty';
import { INTERFACE_TEXT_COLOR } from '~const/interface';
import { Building } from '~entity/building';
import { World } from '~scene/world';
import { Particles } from '~scene/world/effects';
import { ScreenIcon } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import { ParticlesType } from '~type/world/effects';
import {
  BuildingAudio, BuildingParamItem, BuildingEvents, BuildingTexture, BuildingVariant,
} from '~type/world/entities/building';

export class BuildingGenerator extends Building {
  static Name = 'Generator';

  static Description = 'Resource generation for builds and upgrades';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: 400, icon: ScreenIcon.HEALTH },
    { label: 'RESOURCES', value: DIFFICULTY.GENERATOR_RESOURCES, icon: ScreenIcon.RESOURCES },
  ];

  static Texture = BuildingTexture.GENERATOR;

  static Cost = 30;

  static Health = 400;

  static Limit = DIFFICULTY.GENERATOR_LIMIT;

  /**
   * Resources amount left.
   */
  private amountLeft: number = DIFFICULTY.GENERATOR_RESOURCES;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.GENERATOR,
      health: BuildingGenerator.Health,
      texture: BuildingGenerator.Texture,
      actions: {
        pause: 1500, // Pause between generations
      },
    });

    this.on(BuildingEvents.UPGRADE, this.upgradeAmount, this);
  }

  /**
   * Add amount left to building info.
   */
  public getInfo(): BuildingParamItem[] {
    return [
      ...super.getInfo(), {
        label: 'RESOURCES',
        icon: ScreenIcon.RESOURCES,
        color: (this.amountLeft < BUILDING_RESOUCES_LEFT_ALERT)
          ? INTERFACE_TEXT_COLOR.WARN
          : undefined,
        value: this.amountLeft,
      },
    ];
  }

  /**
   * Generate resource and check amount left.
   */
  public update() {
    super.update();

    if (!this.isAllowAction()) {
      return;
    }

    this.generateResource();

    if (this.amountLeft === 0) {
      this.scene.sound.play(BuildingAudio.OVER);
      this.scene.screen.message(NoticeType.WARN, `${this.getMeta().Name} RESOURCES ARE OVER`);

      this.destroy();
    } else {
      this.pauseActions();

      if (this.amountLeft === BUILDING_RESOUCES_LEFT_ALERT) {
        this.addAlert();
      }
    }
  }

  /**
   * Generate resource and give to player.
   */
  private generateResource() {
    this.scene.player.giveResources(1);
    this.amountLeft--;

    new Particles(this, {
      type: ParticlesType.BIT,
      duration: 300,
      params: {
        x: this.x,
        y: this.y + 10 - (this.upgradeLevel * 2.5),
        lifespan: { min: 100, max: 200 },
        scale: { start: 1.0, end: 0.5 },
        speed: 70,
        maxParticles: 6,
        tint: 0x2dffb2,
      },
    });
  }

  /**
   * Update amount left.
   */
  private upgradeAmount() {
    this.amountLeft += DIFFICULTY.GENERATOR_RESOURCES_UPGRADE * (this.upgradeLevel - 1);

    this.removeAlert();
  }
}

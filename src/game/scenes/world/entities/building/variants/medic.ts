import { DIFFICULTY } from '~const/world/difficulty';
import { Player } from '~entity/player';
import { World } from '~scene/world';
import { Particles } from '~scene/world/effects';
import { ParticlesType } from '~type/world/effects';
import {
  BuildingVariant, BuildingTexture, BuildingParam, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingMedic extends Building {
  static Name = 'Medic';

  static Description = 'Heals player, that are in radius of this building';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_MEDIC_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'HEAL', value: DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT, icon: BuildingIcon.HEAL },
  ];

  static Texture = BuildingTexture.MEDIC;

  static Cost = DIFFICULTY.BUILDING_MEDIC_COST;

  static Health = DIFFICULTY.BUILDING_MEDIC_HEALTH;

  static Limit = DIFFICULTY.BUILDING_MEDIC_LIMIT;

  static AllowByWave = DIFFICULTY.BUILDING_MEDIC_ALLOW_BY_WAVE;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.MEDIC,
      health: BuildingMedic.Health,
      texture: BuildingMedic.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_MEDIC_HEAL_RADIUS,
        pause: DIFFICULTY.BUILDING_MEDIC_HEAL_PAUSE,
      },
    });
  }

  /**
   * Check is player inside action area and heal him.
   */
  public update() {
    super.update();

    if (!this.isAllowAction()) {
      return;
    }

    if (this.scene.player.live.isMaxHealth()) {
      return;
    }

    if (!this.actionsAreaContains(this.scene.player)) {
      return;
    }

    this.heal(this.scene.player);
    this.pauseActions();
  }

  /**
   * Add heal amount to building info.
   */
  public getInfo() {
    return [
      ...super.getInfo(), {
        label: 'HEAL',
        icon: BuildingIcon.HEAL,
        value: this.getHealAmount(),
      },
    ];
  }

  /**
   * Get heal amount.
   */
  private getHealAmount() {
    return DIFFICULTY.BUILDING_MEDIC_HEAL_AMOUNT * this.upgradeLevel;
  }

  /**
   * Heal player.
   *
   * @param player - Player
   */
  private heal(player: Player) {
    const health = this.getHealAmount();

    player.live.setHealth(player.live.health + health);

    if (this.visible) {
      new Particles(this, {
        type: ParticlesType.BIT,
        duration: 500,
        params: {
          x: this.x,
          y: this.y,
          lifespan: { min: 100, max: 300 },
          scale: { start: 1.0, end: 0.5 },
          speed: 100,
          maxParticles: 6,
          alpha: 0.75,
        },
      });
    }
  }
}

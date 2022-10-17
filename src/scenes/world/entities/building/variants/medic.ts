import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { DIFFICULTY } from '~const/difficulty';
import { Player } from '~entity/player';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingVariant, BuildingTexture, BuildingDescriptionItem } from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingMedic extends Building {
  static Name = 'Medic';

  static Description = [
    { text: 'Healing a player while\ninside radius.', type: 'text' },
    { text: 'Health: 200', icon: ScreenIcon.HEALTH },
    { text: 'Radius: 200', icon: ScreenIcon.RADIUS },
    { text: 'Pause: 3.0 s', icon: ScreenIcon.PAUSE },
    { text: `Heal: ${DIFFICULTY.MEDIC_HEAL_AMOUNT}`, icon: ScreenIcon.HEAL },
  ];

  static Texture = BuildingTexture.MEDIC;

  static Cost = { bronze: 35, silver: 30, gold: 20 };

  static UpgradeCost = { bronze: 35, silver: 30, gold: 50 };

  static Health = 200;

  static Limit = DIFFICULTY.MEDIC_LIMIT;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MEDIC,
      health: BuildingMedic.Health,
      texture: BuildingMedic.Texture,
      upgradeCost: BuildingMedic.UpgradeCost,
      actions: {
        radius: 200, // Heal radius
        pause: 3000, // Pause between heals
      },
    });
  }

  /**
   * Check if player inside action area and heal him.
   */
  public update() {
    super.update();

    if (!this.isAllowAction()) {
      return;
    }

    const { player } = this.scene;

    if (player.live.isMaxHealth()) {
      return;
    }

    if (!this.actionsAreaContains(player)) {
      return;
    }

    this.heal(player);
    this.pauseActions();
  }

  /**
   * Add heal amount to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextHeal = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? DIFFICULTY.MEDIC_HEAL_AMOUNT * (this.upgradeLevel + 1)
      : null;

    return [
      ...super.getInfo(), {
        text: `Heal: ${this.getHealAmount()}`,
        post: nextHeal && `→ ${nextHeal}`,
        icon: ScreenIcon.HEAL,
      },
    ];
  }

  /**
   * Get heal amount.
   */
  private getHealAmount(): number {
    return DIFFICULTY.MEDIC_HEAL_AMOUNT * this.upgradeLevel;
  }

  /**
   * Heal player.
   *
   * @param player - Player
   */
  private heal(player: Player) {
    const health = this.getHealAmount();

    player.live.setHealth(player.live.health + health);
  }
}

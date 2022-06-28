import Building from '~scene/world/entities/building';
import Player from '~scene/world/entities/player';
import World from '~scene/world';

import { BuildingVariant, BuildingTexture, BuildingDescriptionItem } from '~type/building';

import { MEDIC_HEAL_AMOUNT } from '~const/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';

export default class BuildingMedic extends Building {
  static Name = 'Medic';

  static Description = [
    { text: 'Healing a player while\ninside radius.', type: 'text' },
    { text: 'Health: 200', icon: 0 },
    { text: 'Radius: 200', icon: 1 },
    { text: 'Pause: 3.0 s', icon: 6 },
    { text: `Heal: ${MEDIC_HEAL_AMOUNT}`, icon: 3 },
  ];

  static Texture = BuildingTexture.MEDIC;

  static Cost = { bronze: 35, silver: 30, gold: 20 };

  static UpgradeCost = { bronze: 35, silver: 30, gold: 50 };

  static Health = 200;

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

    if (!this.isAllowActions()) {
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
      ? MEDIC_HEAL_AMOUNT * (this.upgradeLevel + 1)
      : null;
    return [
      ...super.getInfo(),
      { text: `Heal: ${this.getHealAmount()}`, post: nextHeal && `→ ${nextHeal}`, icon: 3 },
    ];
  }

  /**
   * Get heal amount.
   */
  private getHealAmount(): number {
    return MEDIC_HEAL_AMOUNT * this.upgradeLevel;
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

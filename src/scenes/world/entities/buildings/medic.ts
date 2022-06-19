import Building from '~scene/world/entities/building';
import Player from '~scene/world/entities/player';
import World from '~scene/world';

import { BuildingVariant, BuildingTexture } from '~type/building';
import { MEDIC_HEAL_AMOUNT } from '~const/difficulty';

export default class BuildingMedic extends Building {
  static Name = 'Medic';

  static Description = 'Heal player\nHP: 500';

  static Texture = BuildingTexture.MEDIC;

  static Cost = { bronze: 35, silver: 30, gold: 20 };

  static UpgradeCost = { bronze: 35, silver: 30, gold: 50 };

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector3Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MEDIC,
      health: 500,
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
  public getInfo(): string[] {
    return [
      ...super.getInfo(),
      `Heal: ${this.getHealAmount()}`,
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
    player.addLabel(`+${health} HP`);
  }
}

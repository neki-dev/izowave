import { DIFFICULTY } from '~const/difficulty';
import { Player } from '~entity/player';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { BuildingVariant, BuildingTexture, BuildingParamItem } from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingMedic extends Building {
  static Name = 'Medic';

  static Description = 'Heals player, that are in radius of this building';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: 200, icon: ScreenIcon.HEALTH },
    { label: 'HEAL', value: DIFFICULTY.MEDIC_HEAL_AMOUNT, icon: ScreenIcon.HEAL },
  ];

  static Texture = BuildingTexture.MEDIC;

  static Cost = 80;

  static Health = 200;

  static Limit = DIFFICULTY.MEDIC_LIMIT;

  static WaveAllowed = 4;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.MEDIC,
      health: BuildingMedic.Health,
      texture: BuildingMedic.Texture,
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
  public getInfo(): BuildingParamItem[] {
    return [
      ...super.getInfo(), {
        label: 'HEAL',
        icon: ScreenIcon.HEAL,
        value: this.getHealAmount(),
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

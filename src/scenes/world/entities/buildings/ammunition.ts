import Building from '~scene/world/entities/building';
import World from '~scene/world';

import {
  BuildingDescriptionItem, BuildingEvents, BuildingTexture, BuildingVariant,
} from '~type/building';
import { NoticeType } from '~type/interface';

import { AMMUNITION_AMMO_LIMIT, AMMUNITION_AMMO_UPGRADE, AMMUNITION_LIMIT } from '~const/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';

export default class BuildingAmmunition extends Building {
  static Name = 'Ammunition';

  static Description = [
    { text: 'Ammo for towers.\nTo reload tower must\nbe inside radius.', type: 'text' },
    { text: 'Health: 300', icon: 0 },
    { text: 'Radius: 160', icon: 1 },
    { text: `Amount: ${AMMUNITION_AMMO_LIMIT}`, icon: 2 },
  ];

  static Texture = BuildingTexture.AMMUNITION;

  static Cost = { bronze: 20, silver: 20, gold: 5 };

  static UpgradeCost = { bronze: 30, silver: 30, gold: 40 };

  static Health = 300;

  static Limit = AMMUNITION_LIMIT;

  /**
   * Ammo amount left.
   */
  private _amountLeft: number = AMMUNITION_AMMO_LIMIT;

  public get amountLeft() { return this._amountLeft; }

  private set amountLeft(v) { this._amountLeft = v; }

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.AMMUNITION,
      health: BuildingAmmunition.Health,
      texture: BuildingAmmunition.Texture,
      upgradeCost: BuildingAmmunition.UpgradeCost,
      actions: {
        radius: 160, // Reload towers radius
      },
    });

    this.on(BuildingEvents.UPGRADE, this.upgradeAmount, this);
  }

  /**
   * Add amount left to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextLeft = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.amountLeft + (AMMUNITION_AMMO_UPGRADE * this.upgradeLevel)
      : null;
    return [
      ...super.getInfo(),
      { text: `Left: ${this.amountLeft}`, post: nextLeft && `→ ${nextLeft}`, icon: 2 },
    ];
  }

  /**
   * Use ammo.
   */
  public use(amount: number): number {
    if (this.amountLeft <= amount) {
      const left = this.amountLeft;
      this.scene.screen.message(NoticeType.WARN, `${this.getName()} ARE OVER`);
      this.destroy();
      return left;
    }

    this.amountLeft -= amount;

    return amount;
  }

  /**
   * Update amount left.
   */
  private upgradeAmount() {
    this.amountLeft += AMMUNITION_AMMO_UPGRADE * (this.upgradeLevel - 1);
  }
}

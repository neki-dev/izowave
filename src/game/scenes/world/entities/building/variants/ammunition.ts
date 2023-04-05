import { DIFFICULTY } from '~const/world/difficulty';
import { World } from '~scene/world';
import { NoticeType } from '~type/screen';
import {
  BuildingAudio, BuildingParam, BuildingEvents, BuildingTexture, BuildingVariant, BuildingVariantData, BuildingIcon,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingAmmunition extends Building {
  static Name = 'Ammunition';

  static Description = 'Reloading towers ammo, that are in radius of this building';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_AMMUNITION_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'AMMO', value: DIFFICULTY.BUILDING_AMMUNITION_AMMO, icon: BuildingIcon.AMMO },
  ];

  static Texture = BuildingTexture.AMMUNITION;

  static Cost = DIFFICULTY.BUILDING_AMMUNITION_COST;

  static Health = DIFFICULTY.BUILDING_AMMUNITION_HEALTH;

  static Limit = DIFFICULTY.BUILDING_AMMUNITION_LIMIT;

  static AllowByWave = DIFFICULTY.BUILDING_AMMUNITION_ALLOW_BY_WAVE;

  /**
   * Ammo amount left.
   */
  private _amountLeft: number = DIFFICULTY.BUILDING_AMMUNITION_AMMO;

  public get amountLeft() { return this._amountLeft; }

  private set amountLeft(v) { this._amountLeft = v; }

  /**
   * Building variant constructor.
   */
  constructor(scene: World, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.AMMUNITION,
      health: BuildingAmmunition.Health,
      texture: BuildingAmmunition.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_AMMUNITION_RELOAD_RADIUS,
      },
    });

    this.on(BuildingEvents.UPGRADE, this.upgradeAmount, this);
  }

  /**
   * Add amount left to building info.
   */
  public getInfo() {
    return [
      ...super.getInfo(), {
        label: 'AMMO',
        icon: BuildingIcon.AMMO,
        value: this.amountLeft,
      },
    ];
  }

  /**
   * Use ammo.
   */
  public use(amount: number) {
    if (this.amountLeft <= amount) {
      const left = this.amountLeft;

      this.scene.sound.play(BuildingAudio.OVER);
      this.scene.game.screen.notice(NoticeType.WARN, `${this.getMeta().Name} ARE OVER`);

      this.destroy();

      return left;
    }

    this.amountLeft -= amount;

    return amount;
  }

  /**
   * Update amount left by upgrade level.
   */
  private upgradeAmount() {
    this.amountLeft += DIFFICULTY.BUILDING_AMMUNITION_AMMO_UPGRADE * (this.upgradeLevel - 1);
  }
}

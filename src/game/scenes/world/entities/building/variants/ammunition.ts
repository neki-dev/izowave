import { DIFFICULTY } from '~const/world/difficulty';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import {
  BuildingAudio, BuildingParamItem, BuildingEvents, BuildingTexture, BuildingVariant, BuildingVariantData,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingAmmunition extends Building {
  static Name = 'Ammunition';

  static Description = 'Reloading towers ammo, that are in radius of this building';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_AMMUNITION_HEALTH, icon: ScreenIcon.HEALTH },
    { label: 'AMMO', value: DIFFICULTY.BUILDING_AMMUNITION_AMMO, icon: ScreenIcon.AMMO },
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
  public getInfo(): BuildingParamItem[] {
    return [
      ...super.getInfo(), {
        label: 'AMMO',
        icon: ScreenIcon.AMMO,
        value: this.amountLeft,
      },
    ];
  }

  /**
   * Use ammo.
   */
  public use(amount: number): number {
    if (this.amountLeft <= amount) {
      const left = this.amountLeft;

      this.scene.sound.play(BuildingAudio.OVER);
      this.scene.game.screen.message(NoticeType.WARN, `${this.getMeta().Name} ARE OVER`);

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

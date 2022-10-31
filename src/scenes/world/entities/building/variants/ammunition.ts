import { DIFFICULTY } from '~const/difficulty';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import {
  BuildingAudio,
  BuildingParamItem, BuildingEvents, BuildingTexture, BuildingVariant,
} from '~type/world/entities/building';

import { Building } from '../building';

export class BuildingAmmunition extends Building {
  static Name = 'Ammunition';

  static Description = 'Reloading towers ammo, that are in radius of this building';

  static Params: BuildingParamItem[] = [
    { label: 'HEALTH', value: 300, icon: ScreenIcon.HEALTH },
    { label: 'AMMO', value: DIFFICULTY.AMMUNITION_AMMO, icon: ScreenIcon.AMMO },
  ];

  static Texture = BuildingTexture.AMMUNITION;

  static Cost = 30;

  static Health = 300;

  static Limit = DIFFICULTY.AMMUNITION_LIMIT;

  static WaveAllowed = 2;

  /**
   * Ammo amount left.
   */
  private _amountLeft: number = DIFFICULTY.AMMUNITION_AMMO;

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
      actions: {
        radius: 160, // Reload towers radius
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
      this.scene.screen.message(NoticeType.WARN, `${this.getMeta().Name} ARE OVER`);

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
    this.amountLeft += DIFFICULTY.AMMUNITION_AMMO_UPGRADE * (this.upgradeLevel - 1);
  }
}

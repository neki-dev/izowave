import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { World } from '~scene/world';
import { BuildingTower } from '~scene/world/entities/buildings/tower';
import { ScreenIcon } from '~type/screen';
import { BuildingDescriptionItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';
import { ShotType } from '~type/world/entities/shot';

export class BuildingTowerLazer extends BuildingTower {
  static Name = 'Lazer tower';

  static Description = [
    { text: 'Instant and continuous\nlaser attack of enemy.', type: 'text' },
    { text: 'Health: 300', icon: ScreenIcon.HEALTH },
    { text: 'Radius: 180', icon: ScreenIcon.RADIUS },
    { text: 'Pause: 1.6 s', icon: ScreenIcon.PAUSE },
    { text: 'Damage: 75', icon: ScreenIcon.DAMAGE },
  ];

  static Texture = BuildingTexture.TOWER_LAZER;

  static Cost = { bronze: 45, silver: 40, gold: 40 };

  static UpgradeCost = { bronze: 45, silver: 40, gold: 80 };

  static Health = 300;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_LAZER,
      health: BuildingTowerLazer.Health,
      texture: BuildingTowerLazer.Texture,
      upgradeCost: BuildingTowerLazer.UpgradeCost,
      actions: {
        radius: 180, // Attack radius
        pause: 1600, // Pause between shoots
      },
      shotType: ShotType.LAZER,
      shotData: {
        damage: 15,
      },
    });
  }

  /**
   * Add damage to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextDamage = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.getShotParams(this.upgradeLevel + 1).damage * 5
      : null;

    return [
      ...super.getInfo(), {
        text: `Damage: ${this.getShotParams().damage * 5}`,
        post: nextDamage && `→ ${nextDamage}`,
        icon: ScreenIcon.DAMAGE,
      },
    ];
  }
}

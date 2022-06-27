import BuildingTower from '~scene/world/entities/buildings/tower';
import World from '~scene/world';

import { BuildingDescriptionItem, BuildingTexture, BuildingVariant } from '~type/building';
import { ShotType } from '~type/shot';

import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';

export default class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = [
    { text: 'Basic attack of enemy\nwith a fireball.', type: 'text' },
    { text: 'Health: 600', icon: 0 },
    { text: 'Radius: 215', icon: 1 },
    { text: 'Pause: 1.4 s', icon: 6 },
    { text: 'Speed: 55', icon: 7 },
    { text: 'Damage: 35', icon: 4 },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = { bronze: 35, silver: 20 };

  static UpgradeCost = { bronze: 35, silver: 20, gold: 70 };

  static Health = 600;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FIRE,
      health: BuildingTowerFire.Health,
      texture: BuildingTowerFire.Texture,
      upgradeCost: BuildingTowerFire.UpgradeCost,
      actions: {
        radius: 215, // Attack radius
        pause: 1400, // Pause between shoots
      },
      shotType: ShotType.FIRE,
      shotData: {
        damage: 35,
        speed: 550,
      },
    });
  }

  /**
   * Add damage to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextDamage = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.getShotParams(this.upgradeLevel + 1).damage
      : null;
    return [
      ...super.getInfo(), {
        text: `Damage: ${this.getShotParams().damage}`,
        post: nextDamage && `→ ${nextDamage}`,
        icon: 4,
      },
    ];
  }
}

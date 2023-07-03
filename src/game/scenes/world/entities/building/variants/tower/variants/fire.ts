import { DIFFICULTY } from '~const/world/difficulty';
import { TILE_META } from '~const/world/level';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import {
  BuildingIcon,
  BuildingParam, BuildingTexture, BuildingVariant, BuildingVariantData,
} from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = 'Basic fire attack of enemies';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'RADIUS', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_RADIUS, icon: BuildingIcon.RADIUS },
    { label: 'DAMAGE', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_DAMAGE, icon: BuildingIcon.DAMAGE },
    { label: 'SPEED', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_SPEED, icon: BuildingIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = DIFFICULTY.BUILDING_TOWER_FIRE_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
      damage: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_DAMAGE,
      speed: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FIRE,
      health: BuildingTowerFire.Health,
      texture: BuildingTowerFire.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_RADIUS,
        pause: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_PAUSE,
      },
    }, shot);

    let hintId: Nullable<string> = null;

    const hideCurrentHint = () => {
      if (hintId) {
        this.scene.hideHint(hintId);
        hintId = null;
      }
    };

    const unbindUpgradeStep = this.scene.game.tutorial.bind(TutorialStep.UPGRADE_BUILDING, {
      beg: () => {
        if (
          this.upgradeLevel === 1
          && this.scene.player.resources >= this.getUpgradeCost()
        ) {
          hintId = this.scene.showHint({
            side: 'top',
            text: 'Hover on building and press [U] to upgrade',
            position: {
              x: this.x,
              y: this.y + TILE_META.height,
            },
          });
        }
      },
      end: hideCurrentHint,
    });

    const unbindReloadStep = this.scene.game.tutorial.bind(TutorialStep.RELOAD_BUILDING, {
      beg: () => {
        if (this.ammo === 0) {
          hintId = this.scene.showHint({
            side: 'top',
            text: 'Hover on building and press [R] to reload ammo',
            position: {
              x: this.x,
              y: this.y + TILE_META.height,
            },
          });
        }
      },
      end: hideCurrentHint,
    });

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      hideCurrentHint();
      unbindUpgradeStep();
      unbindReloadStep();
    });
  }
}

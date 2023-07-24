import { DIFFICULTY } from '~const/world/difficulty';
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
    { label: 'Health', value: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'Radius', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_RADIUS, icon: BuildingIcon.RADIUS },
    { label: 'Damage', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_DAMAGE, icon: BuildingIcon.DAMAGE },
    { label: 'Speed', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_SPEED, icon: BuildingIcon.SPEED },
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
            text: 'Hover and press [E] to upgrade',
            position: this.getPositionOnGround(),
          });
        }
      },
      end: hideCurrentHint,
    });

    const unbindReloadStep = this.scene.game.tutorial.bind(TutorialStep.RELOAD_TOWER, {
      beg: () => {
        if (this.ammo === 0) {
          hintId = this.scene.showHint({
            side: 'top',
            text: 'Build ammunition nearby',
            position: this.getPositionOnGround(),
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

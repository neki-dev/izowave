import { DIFFICULTY } from '~const/world/difficulty';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { Tutorial } from '~lib/tutorial';
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

  static Category = 'Attack';

  static Params: BuildingParam[] = [
    { label: 'Health', value: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH, icon: BuildingIcon.HEALTH },
    { label: 'Radius', value: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS, icon: BuildingIcon.RADIUS },
    { label: 'Damage', value: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE, icon: BuildingIcon.DAMAGE },
    { label: 'Speed', value: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED, icon: BuildingIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = DIFFICULTY.BUILDING_TOWER_FIRE_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH;

  static MaxLevel = 5;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
      damage: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE,
      speed: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FIRE,
      health: BuildingTowerFire.Health,
      texture: BuildingTowerFire.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY_GROWTH,
      },
    }, shot);

    this.bindTutorialHint(
      TutorialStep.UPGRADE_BUILDING,
      this.scene.game.device.os.desktop
        ? 'Hover and press [E]\nto upgrade'
        : 'Click to upgrade',
    );

    this.bindTutorialHint(
      TutorialStep.RELOAD_TOWER,
      'Build ammunition nearby',
      () => this.ammo === 0,
    );

    if (Tutorial.IsInProgress(TutorialStep.BUILD_TOWER_FIRE)) {
      Tutorial.Complete(TutorialStep.BUILD_TOWER_FIRE);
      Tutorial.Start(TutorialStep.BUILD_GENERATOR);
    }
  }
}

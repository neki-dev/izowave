import { DIFFICULTY } from '~const/world/difficulty';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { TutorialStep, TutorialStepState } from '~type/tutorial';
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
    { label: 'Radius', value: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS, icon: BuildingIcon.RADIUS },
    { label: 'Damage', value: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE, icon: BuildingIcon.DAMAGE },
    { label: 'Speed', value: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED, icon: BuildingIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = DIFFICULTY.BUILDING_TOWER_FIRE_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH;

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
        ? 'Hover and press [E] to upgrade'
        : 'Click to upgrade',
    );

    this.bindTutorialHint(
      TutorialStep.RELOAD_TOWER,
      'Build ammunition nearby',
      () => this.ammo === 0,
    );

    if (this.scene.game.tutorial.state(TutorialStep.BUILD_TOWER_FIRE) === TutorialStepState.IN_PROGRESS) {
      this.scene.game.tutorial.complete(TutorialStep.BUILD_TOWER_FIRE);
      this.scene.game.tutorial.start(TutorialStep.BUILD_GENERATOR);
    }
  }
}

import { BuildingTower } from '..';
import { BuildingCategory, BuildingTexture, BuildingVariant } from '../../../types';
import type { BuildingVariantData } from '../../../types';

import { BUILDING_TOWER_FIRE_COST, BUILDING_TOWER_FIRE_RADIUS, BUILDING_TOWER_FIRE_DAMAGE, BUILDING_TOWER_FIRE_SHOT_SPEED, BUILDING_TOWER_FIRE_HEALTH, BUILDING_TOWER_FIRE_RADIUS_GROWTH, BUILDING_TOWER_FIRE_DELAY, BUILDING_TOWER_FIRE_DELAY_GROWTH } from './const';

import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import type { WorldScene } from '~scene/world';
import { ShotBallFire } from '~scene/world/entities/shot/ball/variants/fire';

export class BuildingTowerFire extends BuildingTower {
  static Category = BuildingCategory.ATTACK;

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = BUILDING_TOWER_FIRE_COST;

  static Radius = BUILDING_TOWER_FIRE_RADIUS;

  static MaxLevel = 5;

  constructor(scene: WorldScene, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
      damage: BUILDING_TOWER_FIRE_DAMAGE,
      speed: BUILDING_TOWER_FIRE_SHOT_SPEED,
    });

    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_FIRE,
      health: BUILDING_TOWER_FIRE_HEALTH,
      texture: BuildingTowerFire.Texture,
      radius: {
        default: BUILDING_TOWER_FIRE_RADIUS,
        growth: BUILDING_TOWER_FIRE_RADIUS_GROWTH,
      },
      delay: {
        default: BUILDING_TOWER_FIRE_DELAY,
        growth: BUILDING_TOWER_FIRE_DELAY_GROWTH,
      },
    }, shot);

    this.bindTutorialHint(
      TutorialStep.UPGRADE_BUILDING,
      this.scene.game.isDesktop()
        ? 'TUTORIAL_HOVER_TO_UPGRADE'
        : 'TUTORIAL_CLICK_TO_UPGRADE',
    );

    this.bindTutorialHint(
      TutorialStep.RELOAD_TOWER,
      'TUTORIAL_RELOAD_TOWER',
      () => this.ammo === 0,
    );

    if (Tutorial.IsInProgress(TutorialStep.BUILD_TOWER_FIRE)) {
      Tutorial.Complete(TutorialStep.BUILD_TOWER_FIRE);
      Tutorial.Start(TutorialStep.BUILD_GENERATOR);
    }
  }
}

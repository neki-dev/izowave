import { DIFFICULTY } from '~const/world/difficulty';
import { TILE_META } from '~const/world/level';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import {
  BuildingParam, BuildingTexture, BuildingVariant, BuildingVariantData,
} from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = 'Basic fire attack of enemies';

  static Params: BuildingParam[] = [
    { label: 'HEALTH', value: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH, icon: ScreenIcon.HEALTH },
    { label: 'RADIUS', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_RADIUS, icon: ScreenIcon.RADIUS },
    { label: 'DAMAGE', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_DAMAGE, icon: ScreenIcon.DAMAGE },
    { label: 'SPEED', value: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_SPEED, icon: ScreenIcon.SPEED },
  ];

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = DIFFICULTY.BUILDING_TOWER_FIRE_COST;

  static Health = DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, data: BuildingVariantData) {
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

    this.scene.game.tutorial.onBeg(TutorialStep.UPGRADE_BUILDING, () => {
      this.scene.showHint({
        side: 'top',
        text: 'Hover on building and press [U] to upgrade',
        position: {
          x: this.x,
          y: this.y + TILE_META.height,
        },
      });
    });
    this.scene.game.tutorial.onEnd(TutorialStep.UPGRADE_BUILDING, () => {
      this.scene.hideHint();
    });
    this.scene.game.tutorial.onBeg(TutorialStep.RELOAD_BUILDING, () => {
      if (this.ammoLeft === 0) {
        this.scene.showHint({
          side: 'top',
          text: 'Hover on building and press [R] to reload ammo',
          position: {
            x: this.x,
            y: this.y + TILE_META.height,
          },
        });
      }
    });
    this.scene.game.tutorial.onEnd(TutorialStep.RELOAD_BUILDING, () => {
      this.scene.hideHint();
    });
  }
}

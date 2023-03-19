import { DIFFICULTY } from '~const/world/difficulty';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { BuildingParamItem, BuildingTexture, BuildingVariant } from '~type/world/entities/building';

import { BuildingTower } from '../tower';

export class BuildingTowerFire extends BuildingTower {
  static Name = 'Fire tower';

  static Description = 'Basic fire attack of enemies';

  static Params: BuildingParamItem[] = [
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
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      positionAtMatrix,
      variant: BuildingVariant.TOWER_FIRE,
      health: BuildingTowerFire.Health,
      texture: BuildingTowerFire.Texture,
      actions: {
        radius: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_RADIUS,
        pause: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_PAUSE,
      },
      shotData: {
        instance: ShotBallFire,
        params: {
          damage: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_DAMAGE,
          speed: DIFFICULTY.BUILDING_TOWER_FIRE_ATTACK_SPEED,
        },
      },
    });

    this.scene.game.tutorial.onBeg(TutorialStep.UPGRADE_BUILDING, () => {
      const isHelpExist = this.scene.selectBuildings(BuildingVariant.TOWER_FIRE)
        .some((building) => building.help);

      if (!isHelpExist) {
          this.addHelp('Hover on building and press [U] to upgrade');
        }
    });
    this.scene.game.tutorial.onBeg(TutorialStep.RELOAD_BUILDING, () => {
          this.addHelp('Hover on building and press [R] to reload ammo');
    });
    this.scene.game.tutorial.onEndAny(() => {
      this.removeHelp();
    });
  }
}

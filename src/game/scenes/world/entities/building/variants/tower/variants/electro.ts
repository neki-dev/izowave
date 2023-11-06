import { DIFFICULTY } from '~const/world/difficulty';
import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { progressionLinear } from '~lib/progression';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import {
  BuildingAudio,
  BuildingCategory,
  BuildingIcon,
  BuildingParam,
  BuildingTexture,
  BuildingVariant,
  BuildingVariantData,
} from '~type/world/entities/building';
import { IEnemy } from '~type/world/entities/npc/enemy';

import { BuildingTower } from '../tower';

export class BuildingTowerElectro extends BuildingTower {
  static Category = BuildingCategory.ATTACK;

  static Texture = BuildingTexture.TOWER_ELECTRO;

  static Cost = DIFFICULTY.BUILDING_TOWER_ELECTRO_COST;

  static Radius = DIFFICULTY.BUILDING_TOWER_ELECTRO_RADIUS;

  static AllowByWave = DIFFICULTY.BUILDING_TOWER_ELECTRO_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  private area: Nullable<Phaser.GameObjects.Ellipse> = null;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.TOWER_ELECTRO,
      health: DIFFICULTY.BUILDING_TOWER_ELECTRO_HEALTH,
      texture: BuildingTowerElectro.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_TOWER_ELECTRO_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_ELECTRO_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_ELECTRO_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_ELECTRO_DELAY_GROWTH,
      },
    });

    this.addArea();

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeArea();
    });
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_DAMAGE',
      icon: BuildingIcon.DAMAGE,
      value: Math.round(this.getDamage()),
    }];

    return info.concat(super.getInfo());
  }

  private addArea() {
    if (this.area) {
      return;
    }

    const position = this.getBottomEdgePosition();

    this.area = this.scene.add.ellipse(position.x, position.y);
    this.area.setFillStyle(0xc9e7dd, 0.15);
    this.area.setActive(false);
    this.area.setVisible(false);
  }

  private removeArea() {
    if (!this.area) {
      return;
    }

    this.area.destroy();
    this.area = null;
  }

  public updateActionArea() {
    super.updateActionArea();

    if (this.area) {
      const radius = this.getActionsRadius();

      this.area.setSize(radius * 2, radius * 2 * LEVEL_MAP_PERSPECTIVE);
      this.area.updateDisplayOrigin();
    }
  }

  private getDamage() {
    return progressionLinear({
      defaultValue: DIFFICULTY.BUILDING_TOWER_ELECTRO_DAMAGE,
      scale: DIFFICULTY.BUILDING_TOWER_ELECTRO_DAMAGE_GROWTH,
      level: this.upgradeLevel,
    }) * this.power;
  }

  public getTargets() {
    return this.scene.getEntities<IEnemy>(EntityType.ENEMY).filter((enemy) => (
      !enemy.live.isDead()
      && this.actionsAreaContains(enemy.getBottomEdgePosition())
    ));
  }

  public shoot(targets: IEnemy[]) {
    const damage = this.getDamage();

    targets.forEach((target) => {
      if (target.active && !target.live.isDead()) {
        this.scene.fx.createElectroEffect(target);
        target.live.damage(damage);
      }
    });

    this.scene.fx.playSound(BuildingAudio.ELECTRO, {
      limit: 1,
    });

    if (this.area) {
      this.area.setActive(true);
      this.area.setVisible(true);

      this.scene.tweens.add({
        targets: this.area,
        alpha: { from: 1.0, to: 0.0 },
        duration: 300,
        onComplete: () => {
          if (this.area) {
            this.area.setActive(false);
            this.area.setVisible(false);
            this.area.setAlpha(1.0);
          }
        },
      });
    }
  }
}

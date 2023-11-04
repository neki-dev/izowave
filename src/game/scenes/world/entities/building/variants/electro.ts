import { DIFFICULTY } from '~const/world/difficulty';
import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { progressionLinear } from '~lib/progression';
import { Building } from '~scene/world/entities/building';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import {
  BuildingCategory,
  BuildingEvents,
  BuildingIcon,
  BuildingParam,
  BuildingTexture,
  BuildingVariant,
  BuildingVariantData,
  IBuilding,
  IBuildingBooster,
} from '~type/world/entities/building';
import { IEnemy } from '~type/world/entities/npc/enemy';

export class BuildingElectro extends Building implements IBuilding {
  static Category = BuildingCategory.ATTACK;

  static Texture = BuildingTexture.ELECTRO;

  static Cost = DIFFICULTY.BUILDING_ELECTRO_COST;

  static Radius = DIFFICULTY.BUILDING_ELECTRO_RADIUS;

  static AllowByWave = DIFFICULTY.BUILDING_ELECTRO_ALLOW_BY_WAVE;

  static MaxLevel = 5;

  private power: number = 1.0;

  private area: Nullable<Phaser.GameObjects.Ellipse> = null;

  constructor(scene: IWorld, data: BuildingVariantData) {
    super(scene, {
      ...data,
      variant: BuildingVariant.ELECTRO,
      health: DIFFICULTY.BUILDING_ELECTRO_HEALTH,
      texture: BuildingElectro.Texture,
      radius: {
        default: DIFFICULTY.BUILDING_ELECTRO_RADIUS,
        growth: DIFFICULTY.BUILDING_ELECTRO_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_ELECTRO_DELAY,
        growth: DIFFICULTY.BUILDING_ELECTRO_DELAY_GROWTH,
      },
    });

    this.handleBuildingRelease();

    this.calculatePower();
    this.addArea();

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeArea();
    });
  }

  public update() {
    super.update();

    if (!this.isActionAllowed()) {
      return;
    }

    this.attack();
    this.pauseActions();
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_DAMAGE',
      icon: BuildingIcon.DAMAGE,
      value: Math.round(this.getDamage()),
    }];

    return super.getInfo().concat(info);
  }

  public getTopFace() {
    const position = super.getTopFace();

    position.y -= 5;

    return position;
  }

  private addArea() {
    if (this.area) {
      return;
    }

    const position = this.getBottomFace();

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
      defaultValue: DIFFICULTY.BUILDING_ELECTRO_DAMAGE,
      scale: DIFFICULTY.BUILDING_ELECTRO_DAMAGE_GROWTH,
      level: this.upgradeLevel,
    }) * this.power;
  }

  private attack() {
    const enemies: IEnemy[] = [];

    this.scene.getEntities<IEnemy>(EntityType.ENEMY).forEach((enemy) => {
      if (this.actionsAreaContains(enemy.getBottomFace())) {
        enemies.push(enemy);
      }
    });

    if (enemies.length > 0) {
      const damage = this.getDamage();

      enemies.forEach((enemy) => {
        if (enemy.active && !enemy.live.isDead()) {
          this.scene.fx.createElectroEffect(enemy);
          enemy.live.damage(damage);
        }
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

  private getBooster() {
    const boosters = this.scene.builder.getBuildingsByVariant<IBuildingBooster>(BuildingVariant.BOOSTER)
      .filter((building) => building.actionsAreaContains(this.getBottomFace()));

    if (boosters.length === 0) {
      return null;
    }

    const priorityBooster = boosters.reduce((max, current) => (
      max.power > current.power ? max : current
    ));

    return priorityBooster;
  }

  private calculatePower() {
    const booster = this.getBooster();

    this.power = 1.0 + (booster?.power ?? 0.0);
  }

  private handleBuildingRelease() {
    const handler = (building: IBuilding) => {
      if (building.variant === BuildingVariant.BOOSTER) {
        this.calculatePower();
      }
    };

    const buidingsGroup = this.scene.getEntitiesGroup(EntityType.BUILDING);

    buidingsGroup.on(BuildingEvents.CREATE, handler);
    buidingsGroup.on(BuildingEvents.UPGRADE, handler);
    buidingsGroup.on(BuildingEvents.BREAK, handler);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      buidingsGroup.off(BuildingEvents.CREATE, handler);
      buidingsGroup.off(BuildingEvents.UPGRADE, handler);
      buidingsGroup.off(BuildingEvents.BREAK, handler);
    });
  }
}

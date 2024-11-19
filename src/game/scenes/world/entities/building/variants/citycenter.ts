import { Building } from '..';
import { BuildingTower } from './tower';
import { DIFFICULTY } from '../../../../../../const/difficulty';
import {
  BuildingCategory, BuildingTexture, BuildingVariant,
} from '../types';

import type { BuildingVariantData } from '../types';
import type { IWorld } from '~scene/world/types';

import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { ShotBallFire } from '~scene/world/entities/shot/ball/variants/fire';
import { BuildingIcon } from '../types';
import { BuildingParam } from '../types';
import { LEVEL_MAP_PERSPECTIVE } from '~scene/world/level/const';
import { City } from '~scene/world/nation/city';

export class BuildingCityCenter extends BuildingTower {
  static Category = BuildingCategory.OTHER;

  static Texture = BuildingTexture.TOWER_FIRE;

  static Cost = DIFFICULTY.BUILDING_GENERATOR_COST;

  static Radius = DIFFICULTY.BUILDING_CITYCENTER_IMPACT_RADIUS;

  static Limit = true;

  static MaxLevel = 4;

  static CityRequired = false;

  private impactArea: Nullable<Phaser.GameObjects.Ellipse> = null;

  constructor(scene: IWorld, data: BuildingVariantData) {
    const shot = new ShotBallFire(scene, {
        damage: DIFFICULTY.BUILDING_TOWER_FIRE_DAMAGE,
        speed: DIFFICULTY.BUILDING_TOWER_FIRE_SHOT_SPEED,
      });

    super(scene, {
      ...data,
      variant: BuildingVariant.CITYCENTER,
      health: DIFFICULTY.BUILDING_TOWER_FIRE_HEALTH,
      texture: BuildingCityCenter.Texture,
      radius: { // attack action radius
        default: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_RADIUS_GROWTH,
      },
      delay: {
        default: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY,
        growth: DIFFICULTY.BUILDING_TOWER_FIRE_DELAY_GROWTH,
      },
    }, shot);

    if (Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR)) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR);
    } else if (
      Tutorial.IsInProgress(TutorialStep.BUILD_GENERATOR_SECOND)
      && this.scene.builder.getBuildingsByVariant(BuildingVariant.GENERATOR).length > 0
    ) {
      Tutorial.Complete(TutorialStep.BUILD_GENERATOR_SECOND);
      Tutorial.Start(TutorialStep.UPGRADE_BUILDING);
    }

    // Create a city 
    let city = new City(this.scene, this.scene.player.getNation(), 'City Name', this);
    this.setCity(city);
    this.scene.player.getNation().addCity(city);
    
    this.addImpactArea();
  }

  public getImpactRadius() {
    let radius = BuildingCityCenter.Radius;

    return radius;
  }

  private addImpactArea() {
    if (this.impactArea) {
      return;
    }

    const position = this.getBottomEdgePosition();

    this.impactArea = this.scene.add.ellipse(position.x, position.y);
    this.impactArea.setFillStyle(0xaaaaff, 0.3);
    this.impactArea.setVisible(true);

    this.updateImpactArea();

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeImpactArea();
    });
  }

  protected updateImpactArea() {
    if (!this.impactArea) {
      return;
    }
    
    const d = this.getImpactRadius() * 2;

    this.impactArea.setSize(d, d * LEVEL_MAP_PERSPECTIVE);
    this.impactArea.updateDisplayOrigin();
  }

  private removeImpactArea() {
    if (!this.impactArea) {
      return;
    }

    this.impactArea.destroy();
    this.impactArea = null;
  }

  public getInfo() {
    const info: BuildingParam[] = [{
      label: 'BUILDING_POPULATION',
      icon: BuildingIcon.POWER,
      value: `${this.getCity().getPopulation()}/${this.getCity().getMaxPopulation()}`,      
    }];

    return info.concat(super.getInfo());
  }

  public update() {
    super.update();

    try {
      if (this.isActionAllowed()) {
        this.generateResource();
        this.pauseActions();
      }
    } catch (error) {
      console.warn('Failed to update generator generator', error as TypeError);
    }
  }

  public getTopEdgePosition() {
    const position = super.getTopEdgePosition();

    position.y += (this.upgradeLevel === 1) ? 5 : -4;

    return position;
  }

  private generateResource() {
    this.scene.player.giveResources(1);
    this.scene.fx.createGenerationEffect(this);

    this.getCity().growPopulation();
  }
}

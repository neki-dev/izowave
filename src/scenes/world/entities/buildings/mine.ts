import Building from '~scene/world/entities/building';
import World from '~scene/world';

import {
  BuildingData, BuildingDescriptionItem, BuildingEvents, ResourceType,
} from '~type/building';
import { NoticeType } from '~type/interface';

import { MINE_RESOURCES_LIMIT, MINE_RESOURCES_UPGRADE } from '~const/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';

type BuildingMineData = BuildingData & {
  resourceType: ResourceType
};

export default class BuildingMine extends Building {
  /**
   * Resource amount left.
   */
  private amountLeft: number = MINE_RESOURCES_LIMIT;

  /**
   * Generation resource type.
   */
  private resourceType: ResourceType;

  /**
   * Building variant constructor.
   */
  constructor(scene: World, {
    resourceType, ...data
  }: BuildingMineData) {
    super(scene, data);

    this.resourceType = resourceType;

    this.on(BuildingEvents.UPGRADE, this.upgradeAmount, this);
  }

  /**
   * Add amount left to building info.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const nextLeft = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing)
      ? this.amountLeft + (MINE_RESOURCES_UPGRADE * this.upgradeLevel)
      : null;
    return [
      ...super.getInfo(),
      { text: `Left: ${this.amountLeft}`, post: nextLeft && `→ ${nextLeft}`, icon: 5 },
    ];
  }

  /**
   * Generate resource and check amount left.
   */
  public update() {
    super.update();

    if (!this.isAllowActions()) {
      return;
    }

    this.generateResource();

    if (this.amountLeft === 0) {
      this.scene.screen.message(NoticeType.WARN, `${this.getName()} RESOURCES ARE OVER`);
      this.destroy();
    } else {
      this.pauseActions();

      if (this.amountLeft === 10) {
        this.addAlert();
      }
    }
  }

  /**
   * Generate resource and give to player.
   */
  private generateResource() {
    const { player } = this.scene;
    player.giveResources({ [this.resourceType]: 1 });
    this.amountLeft--;
  }

  /**
   * Update amount left.
   */
  private upgradeAmount() {
    this.amountLeft += MINE_RESOURCES_UPGRADE * (this.upgradeLevel - 1);

    this.removeAlert();
  }
}

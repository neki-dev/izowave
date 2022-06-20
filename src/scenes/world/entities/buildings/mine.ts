import Building from '~scene/world/entities/building';
import World from '~scene/world';

import { BuildingData, BuildingEvents, ResourceType } from '~type/building';
import { NoticeType } from '~type/notice';

import { MINE_RESOURCES_LIMIT } from '~const/difficulty';

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
  public getInfo(): string[] {
    return [
      ...super.getInfo(),
      `Left: ${this.amountLeft}`,
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
    if (this.amountLeft <= 0) {
      this.scene.screen.events.emit('notice', {
        message: `${this.getName()} RESOURCES ARE OVER`,
        type: NoticeType.WARN,
      });
      this.destroy();
    } else {
      this.pauseActions();
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
    this.amountLeft += Math.round(MINE_RESOURCES_LIMIT / 2);
  }
}

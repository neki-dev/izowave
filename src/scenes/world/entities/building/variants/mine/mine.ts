import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { DIFFICULTY } from '~const/difficulty';
import { Building } from '~entity/building';
import { World } from '~scene/world';
import { ScreenIcon } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import {
  BuildingAudio, BuildingDescriptionItem, BuildingEvents, BuildingMineData,
} from '~type/world/entities/building';
import { ResourceType } from '~type/world/resources';

export class BuildingMine extends Building {
  /**
   * Resource amount left.
   */
  private amountLeft: number = DIFFICULTY.MINE_RESOURCES;

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
      ? this.amountLeft + (DIFFICULTY.MINE_RESOURCES_UPGRADE * this.upgradeLevel)
      : null;

    return [
      ...super.getInfo(), {
        text: `Left: ${this.amountLeft}`,
        post: nextLeft && `→ ${nextLeft}`,
        icon: ScreenIcon.RESOURCES,
      },
    ];
  }

  /**
   * Generate resource and check amount left.
   */
  public update() {
    super.update();

    if (!this.isAllowAction()) {
      return;
    }

    this.generateResource();

    if (this.amountLeft === 0) {
      this.scene.sound.play(BuildingAudio.OVER);
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
    this.amountLeft += DIFFICULTY.MINE_RESOURCES_UPGRADE * (this.upgradeLevel - 1);

    this.removeAlert();
  }
}

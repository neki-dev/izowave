import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import { calcGrowth, toEven } from '~lib/utils';
import Live from '~scene/world/entities/live';
import ComponentInfoBox from '~scene/screen/components/info-box';
import Hexagon from '~lib/hexagon';
import Level from '~scene/world/level';
import World from '~scene/world';

import { BiomeType, TileType } from '~type/level';
import {
  BuildingActionsParams, BuildingData, BuildingEvents, Resources, BuildingTexture, BuildingVariant,
} from '~type/building';
import { LiveEvents } from '~type/live';

import { TILE_META } from '~const/level';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import {
  BUILDING_ACTION_PAUSE_GROWTH,
  BUILDING_ACTION_RADIUS_GROWTH,
  BUILDING_UPGRADE_EXPERIENCE,
} from '~const/difficulty';

export default class Building extends Phaser.GameObjects.Image {
  // @ts-ignore
  readonly scene: World;

  /**
   * Health managment.
   */
  readonly live: Live;

  /**
   * Variant name.
   */
  readonly variant: BuildingVariant;

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: Phaser.Types.Math.Vector2Like;

  /**
   * Current upgrade level.
   */
  private _upgradeLevel: number = 1;

  public get upgradeLevel() { return this._upgradeLevel; }

  private set upgradeLevel(v) { this._upgradeLevel = v; }

  /**
   * Default upgrade cost.
   */
  private upgradeCost: Resources;

  /**
   * Actions parameters.
   */
  private actions: BuildingActionsParams;

  /**
   * Action pause.
   */
  private actionPause: number = 0;

  /**
   * Action area.
   */
  private actionsArea: Phaser.GameObjects.Ellipse;

  /**
   * Building info UI component.
   */
  private uiBuildingInfo: Phaser.GameObjects.Container;

  /**
   * Pause for detect double click.
   */
  private doubleClickPause: number = 0;

  /**
   * Building constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, health, texture, actions, variant, upgradeCost,
  }: BuildingData) {
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);
    super(scene, positionAtWorld.x, positionAtWorld.y, texture);
    scene.add.existing(this);
    scene.getBuildings().add(this);

    this.live = new Live(health);
    this.actions = actions;
    this.upgradeCost = upgradeCost;
    this.variant = variant;
    this.positionAtMatrix = positionAtMatrix;

    // Configure tile
    this.setOrigin(0.5, TILE_META.origin);
    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    scene.level.putTile(this, TileType.BUILDING, tilePosition);
    scene.refreshNavigationMeta();
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      scene.level.removeTile(tilePosition);
      scene.refreshNavigationMeta();
    });

    this.setInteractive();
    this.addFoundation();
    this.makeActionArea();

    // Add events callbacks
    this.on(Phaser.Input.Events.POINTER_OVER, this.onFocus, this);
    this.live.on(LiveEvents.DEAD, () => this.destroy());
  }

  /**
   * Set interactive by hexagon shape.
   */
  public setInteractive() {
    const shape = new Hexagon(0, 0, TILE_META.halfHeight);
    return super.setInteractive(shape, Hexagon.Contains);
  }

  /**
   * Get action area shape.
   */
  public getActionsArea(): Phaser.Geom.Ellipse {
    return this.actionsArea.geom;
  }

  /**
   * Check if position inside action area.
   *
   * @param position - Position at world.
   */
  public actionsAreaContains(position: Phaser.Types.Math.Vector2Like): boolean {
    const offset = this.actionsArea.getTopLeft();
    return this.getActionsArea().contains(position.x - offset.x, position.y - offset.y);
  }

  /**
   * Pause actions.
   */
  public pauseActions() {
    if (!this.actions?.pause) {
      return;
    }

    const pause = calcGrowth(this.actions.pause, BUILDING_ACTION_PAUSE_GROWTH, this.upgradeLevel);
    this.actionPause = this.scene.getTimerNow() + pause;
  }

  /**
   * Check if actions is not pused.
   */
  public isAllowActions(): boolean {
    if (!this.actions?.pause) {
      return true;
    }

    return (this.actionPause < this.scene.getTimerNow());
  }

  /**
   * Get building information labels.
   */
  public getInfo(): string[] {
    return [
      `HP: ${this.live.health}`,
    ];
  }

  /**
   * Get next upgrade cost.
   */
  public upgradeLevelCost(): Resources {
    const multiply = 1 + ((this.upgradeLevel - 1) / 2);
    return Object.entries(this.upgradeCost).reduce((curr, [resource, cost]) => ({
      ...curr,
      [resource]: Math.round(cost * multiply),
    }), {});
  }

  /**
   * Add rubble foundation around building.
   */
  private addFoundation() {
    const { level } = this.scene;
    const { x, y } = this.positionAtMatrix;
    for (let iy = y - 1; iy <= y + 1; iy++) {
      for (let ix = x - 1; ix <= x + 1; ix++) {
        const tileGround = level.getTile({ x: ix, y: iy, z: 0 });
        if (tileGround && tileGround.biome.solid) {
          // Replace biome
          const newBiome = Level.GetBiome(BiomeType.RUBBLE);
          tileGround.biome = newBiome;
          tileGround.clearTint();
          const frame = Array.isArray(newBiome.tileIndex)
            ? Phaser.Math.Between(...newBiome.tileIndex)
            : newBiome.tileIndex;
          tileGround.setFrame(frame);
          // Remove trees
          const tilePosition = { x: ix, y: iy, z: 1 };
          const tile = level.getTileWithType(tilePosition, TileType.TREE);
          if (tile) {
            level.removeTile(tilePosition);
            tile.destroy();
          }
        }
      }
    }
  }

  /**
   * Upgrade building to next level.
   */
  private nextUpgrade() {
    if (this.upgradeLevel === BUILDING_MAX_UPGRADE_LEVEL) {
      return;
    }

    this.upgradeLevel++;
    this.updateActionArea();
    this.setFrame(this.upgradeLevel - 1);

    this.emit(BuildingEvents.UPGRADE, this.upgradeLevel);

    this.live.heal();

    const { player } = this.scene;
    player.giveExperience(BUILDING_UPGRADE_EXPERIENCE * (this.upgradeLevel - 1));
    player.addLabel('UPGRADED');
  }

  /**
   * Create action area.
   */
  private makeActionArea() {
    this.actionsArea = this.scene.add.ellipse(this.x, this.y + TILE_META.halfHeight);
    this.actionsArea.setStrokeStyle(2, 0xffffff, 0.5);
    this.actionsArea.setFillStyle(0xffffff, 0.2);
    this.actionsArea.setVisible(false);

    this.updateActionArea();
  }

  /**
   * Update size and depth of action area.
   */
  private updateActionArea() {
    const { persperctive, height, halfHeight } = TILE_META;
    const d = this.getActionsRadius() * 2;
    const out = height * 2;
    this.actionsArea.setSize(d, d * persperctive);
    this.actionsArea.setDepth(Level.GetDepth(this.y + halfHeight, 1, d * persperctive + out));
    this.actionsArea.updateDisplayOrigin();
  }

  /**
   * Get actions radius.
   */
  private getActionsRadius(): number {
    return this.actions?.radius
      ? calcGrowth(this.actions.radius, BUILDING_ACTION_RADIUS_GROWTH, this.upgradeLevel)
      : 64;
  }

  /**
   * Focus event.
   */
  private onFocus() {
    const {
      player, wave, input, builder,
    } = this.scene;

    if (player.live.isDead() || builder.isBuild) {
      return;
    }

    this.actionsArea.setVisible(true);

    const isCanUpgrade = (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing);
    this.uiBuildingInfo = <Phaser.GameObjects.Container> ComponentInfoBox.call(this.scene, {
      x: 0,
      y: 0,
    }, {
      label: () => this.variant.split('_').reverse().join(' '),
      subLabel: () => `UPGRADE ${this.upgradeLevel} OF ${BUILDING_MAX_UPGRADE_LEVEL}`,
      description: () => this.getInfo().join('\n'),
      cost: isCanUpgrade ? () => this.upgradeLevelCost() : undefined,
      costTitle: 'Upgrade',
      player: this.scene.player,
    });
    this.uiBuildingInfo.setPosition(
      this.x - this.uiBuildingInfo.width / 2,
      toEven(this.y - this.uiBuildingInfo.height - TILE_META.halfHeight),
    );

    if (!wave.isGoing) {
      input.setDefaultCursor('pointer');
    }
    input.keyboard.on('keyup-BACKSPACE', this.break, this);

    this.on(Phaser.Input.Events.POINTER_DOWN, this.onClick, this);
    this.on(Phaser.Input.Events.POINTER_OUT, this.onUnfocus, this);
    this.on(Phaser.GameObjects.Events.DESTROY, this.onUnfocus, this);
  }

  /**
   * Unfocus event.
   */
  private onUnfocus() {
    const { input } = this.scene;

    if (this.uiBuildingInfo) {
      this.uiBuildingInfo.destroy();
      delete this.uiBuildingInfo;
    }

    this.actionsArea.setVisible(false);

    input.setDefaultCursor('default');
    input.keyboard.off('keyup-BACKSPACE', this.break);

    this.off(Phaser.Input.Events.POINTER_DOWN, this.onClick);
    this.off(Phaser.Input.Events.POINTER_OUT, this.onUnfocus);
    this.off(Phaser.GameObjects.Events.DESTROY, this.onUnfocus);
  }

  /**
   * Destroy building by keyboard.
   */
  private break() {
    this.destroy();
  }

  /**
   * Click event.
   */
  private onClick() {
    if (
      this.upgradeLevel === BUILDING_MAX_UPGRADE_LEVEL
      || this.scene.wave.isGoing
    ) {
      return;
    }

    const now = this.scene.getTimerNow();
    if (this.doubleClickPause <= now) {
      this.doubleClickPause = now + 300;
      return;
    }

    const cost = this.upgradeLevelCost();
    const { player } = this.scene;
    if (!player.haveResources(cost)) {
      player.addLabel('NOT ENOUGH RESOURCES');
      return;
    }

    player.takeResources(cost);
    this.nextUpgrade();
  }
}

registerAssets(Object.values(BuildingTexture).map((texture) => ({
  key: texture,
  type: 'spritesheet',
  url: `assets/sprites/${texture}.png`,
  frameConfig: {
    frameWidth: TILE_META.width,
    frameHeight: TILE_META.height,
  },
})));

import Phaser from 'phaser';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/building';
import { DIFFICULTY } from '~const/difficulty';
import { INPUT_KEY } from '~const/keyboard';
import { TILE_META } from '~const/level';
import { WORLD_DEPTH_EFFECT, WORLD_DEPTH_UI } from '~const/world';
import { Hexagon } from '~entity/building/hexagon';
import { Live } from '~entity/live';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { ComponentBuildingInfo } from '~scene/screen/components/building-info';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { ScreenIcon, ScreenTexture } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import { WorldEvents } from '~type/world';
import {
  BuildingActionsParams, BuildingData, BuildingEvents, BuildingAudio,
  BuildingTexture, BuildingVariant, BuildingDescriptionItem,
} from '~type/world/entities/building';
import { LiveEvents } from '~type/world/entities/live';
import { TileType } from '~type/world/level';
import { Resources } from '~type/world/resources';

export class Building extends Phaser.GameObjects.Image {
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
  private nextActionTimestamp: number = 0;

  /**
   * Action area.
   */
  private actionsArea: Phaser.GameObjects.Ellipse;

  /**
   * Building info UI component.
   */
  private info: Nullable<Phaser.GameObjects.Container> = null;

  /**
   * Alert.
   */
  private alert: Nullable<Phaser.GameObjects.Image> = null;

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
    scene.buildings.add(this);

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
    this.makeActionArea();
    scene.builder.addFoundation(positionAtMatrix);

    // Add keyboard events
    scene.input.keyboard.on(INPUT_KEY.BUILDING_DESTROY, this.remove, this);
    scene.input.keyboard.on(INPUT_KEY.BUILDING_UPGRADE, this.nextUpgrade, this);

    // Add events callbacks
    this.live.on(LiveEvents.DEAD, () => this.onDead());
    this.scene.events.on(WorldEvents.GAMEOVER, () => this.onUnfocus());
    this.on(Phaser.Input.Events.POINTER_OVER, this.onFocus, this);
    this.on(Phaser.Input.Events.POINTER_OUT, this.onUnfocus, this);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.onUnfocus();
      this.removeAlert();
    });
  }

  /**
   * Set interactive by hexagon shape.
   */
  public setInteractive() {
    const shape = new Hexagon(0, 0, TILE_META.halfHeight);

    return super.setInteractive(shape, Hexagon.Contains);
  }

  /**
   * Update event.
   */
  public update() {
    if (this.alert) {
      this.alert.setVisible(this.visible);
    }
  }

  /**
   * Check if position inside action area.
   *
   * @param position - Position at world
   */
  public actionsAreaContains(position: Phaser.Types.Math.Vector2Like): boolean {
    const offset = this.actionsArea.getTopLeft();

    return this.actionsArea.geom.contains(position.x - offset.x, position.y - offset.y);
  }

  /**
   * Pause actions.
   */
  public pauseActions() {
    if (!this.actions?.pause) {
      return;
    }

    this.nextActionTimestamp = this.scene.getTimerNow() + this.getActionsPause();
  }

  /**
   * Check if actions is not pused.
   */
  public isAllowAction(): boolean {
    if (!this.actions?.pause) {
      return true;
    }

    return (this.nextActionTimestamp < this.scene.getTimerNow());
  }

  /**
   * Get building variant name.
   */
  public getName() {
    return this.variant.split('_').reverse().join(' ');
  }

  /**
   * Get building information labels.
   */
  public getInfo(): BuildingDescriptionItem[] {
    const info: BuildingDescriptionItem[] = [
      { text: `UPGRADE ${this.upgradeLevel} OF ${BUILDING_MAX_UPGRADE_LEVEL}`, type: 'text' },
      { text: `Health: ${this.live.health}`, icon: ScreenIcon.HEALTH },
    ];
    const radius = this.getActionsRadius();
    const pause = this.getActionsPause();

    if (radius) {
      const nextRadius = this.isAllowUpgrade() && calcGrowth(
        this.actions.radius,
        DIFFICULTY.BUILDING_ACTION_RADIUS_GROWTH,
        this.upgradeLevel + 1,
      );

      info.push({
        text: `Radius: ${Math.round(radius / 2)}`,
        post: nextRadius && `→ ${Math.round(nextRadius / 2)}`,
        icon: ScreenIcon.RADIUS,
      });
    }

    if (pause) {
      const nextPause = this.isAllowUpgrade() && calcGrowth(
        this.actions.pause,
        DIFFICULTY.BUILDING_ACTION_PAUSE_GROWTH,
        this.upgradeLevel + 1,
      );

      info.push({
        text: `Pause: ${(pause / 1000).toFixed(1)} s`,
        post: nextPause && `→ ${(nextPause / 1000).toFixed(1)} s`,
        icon: ScreenIcon.PAUSE,
      });
    }

    // if (this.isAllowUpgrade()) {
    //   info.push({
    //     text: 'PRESS |U| TO UPGRADE',
    //     type: 'hint',
    //   });
    // }

    return info;
  }

  /**
   * Check is cursor on building.
   */
  public isSelected(): boolean {
    return this.actionsArea.visible;
  }

  /**
   * Get next upgrade cost.
   */
  public getUpgradeLevelCost(): Resources {
    const multiply = 1 + ((this.upgradeLevel - 1) / 2);

    return Object.entries(this.upgradeCost).reduce((curr, [resource, cost]) => ({
      ...curr,
      [resource]: Math.round(cost * multiply),
    }), {});
  }

  /**
   * Add alert sign.
   */
  public addAlert() {
    if (this.alert) {
      return;
    }

    this.alert = this.scene.add.image(this.x, this.y + TILE_META.halfHeight, ScreenTexture.ALERT);
    this.alert.setDepth(WORLD_DEPTH_EFFECT);
    this.alert.setVisible(this.visible);
    this.scene.tweens.add({
      targets: this.alert,
      scale: 0.8,
      duration: 500,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Remove alert sign.
   */
  public removeAlert() {
    if (!this.alert) {
      return;
    }

    this.alert.destroy();
    this.alert = null;
  }

  /**
   * Get actions radius.
   */
  public getActionsRadius(): number {
    return this.actions?.radius
      ? calcGrowth(
        this.actions.radius,
        DIFFICULTY.BUILDING_ACTION_RADIUS_GROWTH,
        this.upgradeLevel,
      )
      : 0;
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
   * Get actions pause.
   */
  private getActionsPause(): number {
    return this.actions?.pause
      ? calcGrowth(
        this.actions.pause,
        DIFFICULTY.BUILDING_ACTION_PAUSE_GROWTH,
        this.upgradeLevel,
      )
      : 0;
  }

  /**
   * Check if building allow upgrade.
   */
  private isAllowUpgrade(): boolean {
    return (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing);
  }

  /**
   * Dead event.
   */
  private onDead() {
    this.scene.sound.play(BuildingAudio.DEAD);
    this.scene.screen.message(NoticeType.WARN, `${this.getName()} HAS BEEN DESTROYED`);

    this.destroy();
  }

  /**
   * Focus event.
   */
  private onFocus() {
    if (
      this.scene.player.live.isDead()
      || this.scene.builder.isBuild
    ) {
      return;
    }

    this.actionsArea.setVisible(true);
    this.addInfo();

    this.scene.input.setDefaultCursor('pointer');
  }

  /**
   * Unfocus event.
   */
  private onUnfocus() {
    if (!this.actionsArea.visible) {
      return;
    }

    this.actionsArea.setVisible(false);
    if (this.info) {
      this.removeInfo();
    }

    this.scene.input.setDefaultCursor('default');
  }

  /**
   * Add information component.
   */
  private addInfo() {
    if (this.info) {
      return;
    }

    this.info = ComponentBuildingInfo.call(this.scene, {
      player: this.scene.player,
      data: () => ({
        Name: this.getName(),
        Description: this.getInfo(),
        Cost: this.isAllowUpgrade() ? this.getUpgradeLevelCost() : undefined,
      }),
      resize: (ctn: Phaser.GameObjects.Container) => {
        ctn.setPosition(
          this.x - ctn.width / 2,
          this.y - ctn.height - TILE_META.halfHeight,
        );
      },
    });

    this.info.setDepth(WORLD_DEPTH_UI);
  }

  /**
   * Remove information component.
   */
  private removeInfo() {
    if (!this.info) {
      return;
    }

    this.info.destroy();
    this.info = null;
  }

  /**
   * Upgrade building to next level.
   */
  private nextUpgrade() {
    if (!this.isSelected() || !this.isAllowUpgrade()) {
      return;
    }

    const cost = this.getUpgradeLevelCost();
    const { player, screen } = this.scene;

    if (!player.haveResources(cost)) {
      screen.message(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

      return;
    }

    this.upgradeLevel++;

    this.emit(BuildingEvents.UPGRADE, this.upgradeLevel);

    this.updateActionArea();
    this.setFrame(this.upgradeLevel - 1);
    this.live.heal();

    player.takeResources(cost);
    player.giveExperience(DIFFICULTY.BUILDING_UPGRADE_EXPERIENCE * (this.upgradeLevel - 1));

    this.scene.sound.play(BuildingAudio.UPGRADE);
    screen.message(NoticeType.INFO, 'BUILDING UPGRADED');
  }

  /**
   * Break building.
   */
  private remove() {
    if (!this.isSelected()) {
      return;
    }

    this.scene.sound.play(BuildingAudio.REMOVE);

    this.destroy();
  }
}

registerAudioAssets(BuildingAudio);
registerSpriteAssets(BuildingTexture, {
  width: TILE_META.width,
  height: TILE_META.height,
});

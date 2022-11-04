import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { WORLD_DEPTH_EFFECT, WORLD_DEPTH_UI } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { TILE_META } from '~const/world/level';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { ComponentBuildingInfo } from '~scene/screen/components/building-info';
import { ComponentCost } from '~scene/screen/components/building-info/cost';
import { World } from '~scene/world';
import { Effect } from '~scene/world/effects';
import { Hexagon } from '~scene/world/hexagon';
import { Level } from '~scene/world/level';
import { Live } from '~scene/world/live';
import { ScreenIcon, ScreenTexture } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import { WorldEvents } from '~type/world';
import { BuilderEvents } from '~type/world/builder';
import { EffectTexture } from '~type/world/effects';
import {
  BuildingActionsParams, BuildingData, BuildingEvents, BuildingAudio,
  BuildingTexture, BuildingVariant, BuildingParamItem, BuildingMeta, BuildingAction,
} from '~type/world/entities/building';
import { LiveEvents } from '~type/world/entities/live';
import { TileType } from '~type/world/level';

export class Building extends Phaser.GameObjects.Image {
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
   * Actions parameters.
   */
  private actions: BuildingActionsParams;

  /**
   * Action pause.
   */
  private nextActionTimestamp: number = 0;

  /**
   * Building info UI component.
   */
  private info: Nullable<Phaser.GameObjects.Container> = null;

  /**
   * Alert.
   */
  private alert: Nullable<Phaser.GameObjects.Image> = null;

  /**
   * Action area.
   */
  private actionsArea: Phaser.GameObjects.Ellipse;

  /**
   * Focus state.
   */
  private _isFocused: boolean = false;

  public get isFocused() { return this._isFocused; }

  private set isFocused(v) { this._isFocused = v; }

  /**
   *
   */
  private outlineTween: Nullable<Phaser.Tweens.Tween> = null;

  /**
   * Select state.
   */
  private isSelected: boolean = false;

  /**
   * Building constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, health, texture, actions, variant,
  }: BuildingData) {
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);

    super(scene, positionAtWorld.x, positionAtWorld.y, texture);
    scene.add.existing(this);
    scene.entityGroups.buildings.add(this);

    this.live = new Live(health);
    this.actions = actions;
    this.variant = variant;
    this.positionAtMatrix = positionAtMatrix;

    this.setInteractive();
    this.addActionArea();

    scene.builder.addFoundation(positionAtMatrix);

    // Configure tile

    this.setOrigin(0.5, TILE_META.origin);
    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    scene.level.putTile(this, TileType.BUILDING, tilePosition);
    scene.refreshNavigationMeta();

    // Add keyboard events

    scene.input.keyboard.on(CONTROL_KEY.BUILDING_DESTROY, () => {
      if (this.isFocused) {
        this.remove();
      }
    });
    scene.input.keyboard.on(CONTROL_KEY.BUILDING_UPGRADE, () => {
      if (this.isFocused) {
        this.nextUpgrade();
      }
    });

    // Add events callbacks

    this.live.on(LiveEvents.DAMAGE, () => {
      this.onDamage();
    });
    this.live.on(LiveEvents.DEAD, () => {
      this.onDead();
    });

    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.onFocus();
    });
    this.on(Phaser.Input.Events.POINTER_UP, () => {
      this.onClick();
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.onUnfocus();
    });
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.onUnclick();
    });

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.actionsArea.destroy();
      this.scene.level.removeTile(tilePosition);
      this.scene.refreshNavigationMeta();
      this.onUnfocus();
      this.onUnclick();
      this.removeAlert();
    });

    this.scene.events.on(WorldEvents.GAMEOVER, () => {
      this.onUnfocus();
      this.onUnclick();
    });

    this.scene.builder.on(BuilderEvents.BUILD_START, () => {
      this.onUnfocus();
      this.onUnclick();
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
   * Event update.
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
   * Get building information params.
   */
  public getInfo(): BuildingParamItem[] {
    return [{
      label: 'HEALTH',
      icon: ScreenIcon.HEALTH,
      value: this.live.health,
    }];
  }

  /**
   * Get building actions.
   */
  public getActions(): BuildingAction[] {
    const actions: BuildingAction[] = [];

    if (this.isAllowUpgrade()) {
      actions.push({
        label: 'UPGRADE',
        addon: {
          component: ComponentCost,
          props: {
            player: this.scene.player,
            amount: () => this.getUpgradeLevelCost(),
          },
        },
        onClick: () => {
          this.nextUpgrade();
        },
      });
    }

    return actions;
  }

  /**
   * Get next upgrade cost.
   */
  public getUpgradeLevelCost(): number {
    const nextLevel = this.upgradeLevel + 1;
    const costGrow = this.getMeta().Cost / BUILDING_MAX_UPGRADE_LEVEL;

    return Math.round(costGrow * nextLevel);
  }

  /**
   * Get building meta.
   */
  public getMeta(): BuildingMeta {
    return (this.constructor as unknown as BuildingMeta);
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
   * Upgrade building to next level.
   */
  private nextUpgrade() {
    if (!this.isAllowUpgrade()) {
      return;
    }

    const waveAllowed = this.getWaveAllowUpgrade();

    if (waveAllowed > this.scene.wave.getCurrentNumber()) {
      this.scene.screen.message(NoticeType.ERROR, `UPGRADE BE AVAILABLE ON ${waveAllowed} WAVE`);

      return;
    }

    const cost = this.getUpgradeLevelCost();

    if (this.scene.player.resources < cost) {
      this.scene.screen.message(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

      return;
    }

    this.upgradeLevel++;

    this.emit(BuildingEvents.UPGRADE);

    this.updateActionArea();
    this.setFrame(this.upgradeLevel - 1);
    this.live.heal();

    this.scene.player.takeResources(cost);
    this.scene.player.giveExperience(DIFFICULTY.BUILDING_UPGRADE_EXPERIENCE * (this.upgradeLevel - 1));

    this.scene.sound.play(BuildingAudio.UPGRADE);
    this.scene.screen.message(NoticeType.INFO, 'BUILDING UPGRADED');
  }

  /**
   *
   */
  private getWaveAllowUpgrade(): number {
    return (this.getMeta().AllowByWave || 1) + this.upgradeLevel;
  }

  /**
   * Event damage.
   */
  private onDamage() {
    if (!this.visible) {
      return;
    }

    new Effect(this.scene, {
      texture: EffectTexture.DAMAGE,
      position: this,
      rate: 14,
    });
  }

  /**
   * Event dead.
   */
  private onDead() {
    this.scene.screen.message(NoticeType.WARN, `${this.getMeta().Name} HAS BEEN DESTROYED`);

    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.SMOKE,
        audio: BuildingAudio.DEAD,
        position: {
          x: this.x,
          y: this.y + TILE_META.halfHeight,
        },
        rate: 18,
      });
    }

    this.destroy();
  }

  /**
   * Event focus.
   */
  private onFocus() {
    if (
      this.isFocused
      || this.scene.player.live.isDead()
      || this.scene.builder.isBuild
    ) {
      return;
    }

    this.isFocused = true;

    this.scene.input.setDefaultCursor('pointer');
    this.addOutline();
  }

  /**
   * Event unfocus.
   */
  private onUnfocus() {
    if (!this.isFocused) {
      return;
    }

    this.isFocused = false;

    this.scene.input.setDefaultCursor('default');
    if (!this.isSelected) {
      this.removeOutline();
    }
  }

  /**
   * Event click.
   */
  private onClick() {
    if (!this.isFocused || this.isSelected) {
      return;
    }

    this.isSelected = true;

    this.actionsArea.setVisible(true);
    this.addInfo();
    this.updateShader('OutlineShader', {
      color: 0xd0ff4f,
    });
  }

  /**
   * Event unclick.
   */
  private onUnclick() {
    if (this.isFocused || !this.isSelected) {
      return;
    }

    this.isSelected = false;

    this.actionsArea.setVisible(false);
    this.removeInfo();
    this.removeOutline();
  }

  /**
   * Add outline effect.
   */
  private addOutline() {
    if (this.outlineTween) {
      return;
    }

    this.addShader('OutlineShader', {
      size: 0,
      color: 0xffffff,
    });

    this.outlineTween = <Phaser.Tweens.Tween> this.scene.tweens.add({
      targets: this,
      shaderSize: { from: 0, to: 3.0 },
      duration: 350,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      onUpdate: (_, __, ___, size: number) => {
        this.updateShader('OutlineShader', { size });
      },
    });
  }

  /**
   * Remove outline effect.
   */
  private removeOutline() {
    if (!this.outlineTween) {
      return;
    }

    this.removeShader('OutlineShader');

    this.outlineTween.destroy();
    this.outlineTween = null;
  }

  /**
   * Create action area.
   */
  private addActionArea() {
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
   * Add information component.
   */
  private addInfo() {
    if (this.info) {
      return;
    }

    this.info = ComponentBuildingInfo(this.scene, {
      name: this.getMeta().Name,
      upgradeLevel: () => this.upgradeLevel,
      params: () => this.getInfo(),
      actions: () => this.getActions(),
    });

    this.info.setDepth(WORLD_DEPTH_UI);
    this.info.setPosition(
      this.x - this.info.width / 2,
      this.y - this.info.height - TILE_META.halfHeight,
    );
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
   * Add alert sign.
   */
  public addAlert() {
    if (this.alert) {
      return;
    }

    this.alert = this.scene.add.image(this.x, this.y + TILE_META.halfHeight, ScreenTexture.ALERT);
    this.alert.setDepth(WORLD_DEPTH_EFFECT);
    this.alert.setVisible(this.visible);

    const tween = <Phaser.Tweens.Tween> this.scene.tweens.add({
      targets: this.alert,
      scale: 0.8,
      duration: 500,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    });

    this.alert.on(Phaser.GameObjects.Events.DESTROY, () => {
      tween.destroy();
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
   * Break building.
   */
  private remove() {
    new Effect(this.scene, {
      texture: EffectTexture.SMOKE,
      audio: BuildingAudio.REMOVE,
      position: {
        x: this.x,
        y: this.y + TILE_META.halfHeight,
      },
      rate: 18,
    });

    this.destroy();
  }
}

registerAudioAssets(BuildingAudio);
registerSpriteAssets(BuildingTexture, {
  width: TILE_META.width,
  height: TILE_META.height,
});

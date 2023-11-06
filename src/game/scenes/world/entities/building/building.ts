import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { WORLD_DEPTH_GRAPHIC } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_TILE } from '~const/world/entities/building';
import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { Indicator } from '~entity/addons/indicator';
import { Live } from '~entity/addons/live';
import { Analytics } from '~lib/analytics';
import { Assets } from '~lib/assets';
import { progressionQuadratic, progressionLinear } from '~lib/progression';
import { Tutorial } from '~lib/tutorial';
import { Level } from '~scene/world/level';
import { GameEvents } from '~type/game';
import { LangPhrase } from '~type/lang';
import { ILive, LiveEvents } from '~type/live';
import { ShaderType } from '~type/shader';
import { TutorialStep } from '~type/tutorial';
import { IWorld, WorldEvents, WorldMode } from '~type/world';
import { BuilderEvents } from '~type/world/builder';
import { EntityType } from '~type/world/entities';
import {
  BuildingData, BuildingEvents, BuildingAudio,
  BuildingTexture, BuildingVariant, BuildingParam, BuildingControl,
  BuildingOutlineState, IBuildingFactory, IBuilding, BuildingIcon, BuildingGrowthValue, BuildingSavePayload,
} from '~type/world/entities/building';
import { IIndicator, IndicatorData } from '~type/world/entities/indicator';
import { TileType, PositionAtWorld, PositionAtMatrix } from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

Assets.RegisterAudio(BuildingAudio);
Assets.RegisterImages(BuildingIcon);
Assets.RegisterSprites(BuildingTexture, BUILDING_TILE);

export class Building extends Phaser.GameObjects.Image implements IBuilding, ITile {
  readonly scene: IWorld;

  readonly live: ILive;

  readonly variant: BuildingVariant;

  readonly positionAtMatrix: PositionAtMatrix;

  readonly tileType: TileType = TileType.BUILDING;

  private _upgradeLevel: number = 1;

  public get upgradeLevel() { return this._upgradeLevel; }

  private set upgradeLevel(v) { this._upgradeLevel = v; }

  private radius: Nullable<BuildingGrowthValue> = null;

  private delay: Nullable<BuildingGrowthValue> = null;

  private nextActionTimestamp: number = 0;

  private outlineState: BuildingOutlineState = BuildingOutlineState.NONE;

  private alertIcon: Nullable<Phaser.GameObjects.Image> = null;

  private alertTween: Nullable<Phaser.Tweens.Tween> = null;

  private upgradeIcon: Nullable<Phaser.GameObjects.Image> = null;

  private upgradeTween: Nullable<Phaser.Tweens.Tween> = null;

  private actionsArea: Nullable<Phaser.GameObjects.Ellipse> = null;

  private _isFocused: boolean = false;

  public get isFocused() { return this._isFocused; }

  private set isFocused(v) { this._isFocused = v; }

  private toFocus: boolean = false;

  private isSelected: boolean = false;

  private defaultHealth: number = 0;

  private buildTimer: Nullable< Phaser.Time.TimerEvent> = null;

  private buildBar: Nullable<IIndicator> = null;

  private indicators: Phaser.GameObjects.Container;

  constructor(scene: IWorld, {
    positionAtMatrix, buildDuration, health, texture, variant, radius, delay,
  }: BuildingData) {
    const positionAtWorld = Level.ToWorldPosition(positionAtMatrix);

    super(scene, positionAtWorld.x, positionAtWorld.y, texture);
    scene.add.existing(this);
    scene.addEntityToGroup(this, EntityType.BUILDING);

    this.radius = radius ?? null;
    this.delay = delay ?? null;
    this.defaultHealth = health;
    this.variant = variant;
    this.positionAtMatrix = positionAtMatrix;
    this.live = new Live({ health });

    this.setDepth(positionAtWorld.y);
    this.setOrigin(0.5, BUILDING_TILE.origin);
    this.scene.level.putTile(this, { ...positionAtMatrix, z: 1 });

    this.addActionArea();
    this.addIndicatorsContainer();
    this.addIndicator({
      color: 0x96ff0d,
      size: BUILDING_TILE.width / 2,
      value: () => this.live.health / this.live.maxHealth,
    });

    this.updateTileCost();

    this.handlePointer();
    this.handleToggleModes();

    this.scene.spawner.clearCache();

    if (buildDuration && buildDuration > 0) {
      this.startBuildProcess(buildDuration);
    } else {
      setTimeout(() => {
        this.completeBuildProcess();
      }, 0);
    }

    this.bindHotKey(CONTROL_KEY.BUILDING_REPAIR, () => this.repair());
    this.bindHotKey(CONTROL_KEY.BUILDING_UPGRADE, () => this.upgrade());
    this.bindHotKey(CONTROL_KEY.BUILDING_DESTROY, () => this.break());

    this.live.on(LiveEvents.DAMAGE, this.onDamage.bind(this));
    this.live.on(LiveEvents.DEAD, this.onDead.bind(this));

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.stopBuildProcess();

      this.removeIndicatorsContainer();
      this.removeAlertIcon();
      this.removeUpgradeIcon();
      this.removeActionArea();

      this.unfocus();
      this.unselect();

      this.scene.spawner.clearCache();
      this.scene.level.navigator.resetPointCost(positionAtMatrix);
      this.live.destroy();
    });
  }

  public update() {
    try {
      this.updateOutline();
      this.updateIndicators();

      if (this.scene.isModeActive(WorldMode.AUTO_REPAIR)) {
        this.handleAutorepair();
      }

      // Catch focus by camera moving
      if (this.toFocus) {
        this.focus();
      }
    } catch (error) {
      Analytics.TrackWarn('Failed building update', error as TypeError);
    }
  }

  public handleAutorepair() {
    if (this.live.health / this.live.maxHealth <= 0.5) {
      this.repair(true);
    }
  }

  public actionsAreaContains(position: PositionAtWorld) {
    if (!this.active || !this.actionsArea) {
      return false;
    }

    const offset = this.actionsArea.getTopLeft() as PositionAtWorld;
    const contains: boolean = this.actionsArea.geom.contains(position.x - offset.x, position.y - offset.y);

    return contains;
  }

  public pauseActions() {
    if (!this.delay) {
      return;
    }

    this.nextActionTimestamp = this.scene.getTime() + this.getActionsDelay();
  }

  public isActionAllowed() {
    if (!this.delay) {
      return true;
    }

    return this.nextActionTimestamp < this.scene.getTime();
  }

  private updateTileCost() {
    const cost = 2.0 + Number((this.live.maxHealth * DIFFICULTY.BUILDING_TILE_COST_MULTIPLIER).toFixed(1));

    this.scene.level.navigator.setPointCost(this.positionAtMatrix, cost);
  }

  public getInfo() {
    const info: BuildingParam[] = [];
    const delay = this.getActionsDelay();

    if (delay) {
      info.push({
        label: 'BUILDING_DELAY',
        icon: BuildingIcon.DELAY,
        value: `${(delay / 1000).toFixed(1)} s`,
      });
    }

    return info;
  }

  public getControls() {
    const actions: BuildingControl[] = [];

    if (this.isUpgradeAllowed()) {
      actions.push({
        label: 'BUILDING_UPGRADE',
        cost: this.getUpgradeCost(),
        disabled: this.getUpgradeAllowedByWave() > this.scene.wave.number,
        hotkey: 'E',
        onClick: () => {
          this.upgrade();
        },
      });
    }

    actions.push({
      label: 'BUILDING_REPAIR',
      cost: this.getRepairCost(),
      disabled: this.live.isMaxHealth(),
      hotkey: 'R',
      onClick: () => {
        this.repair();
      },
    });

    return actions;
  }

  public getMeta() {
    return this.constructor as IBuildingFactory;
  }

  public getActionsRadius() {
    return this.radius
      ? progressionLinear({
        defaultValue: this.radius.default,
        scale: this.radius.growth,
        level: this.upgradeLevel,
      })
      : 0;
  }

  public getActionsDelay() {
    return this.delay
      ? progressionLinear({
        defaultValue: this.delay.default,
        scale: this.delay.growth,
        level: this.upgradeLevel,
        roundTo: 100,
      })
      : 0;
  }

  public getUpgradeCost(level?: number) {
    const costPerLevel = this.getMeta().Cost;
    const nextLevel = level ?? this.upgradeLevel;

    return Math.round(costPerLevel * nextLevel * DIFFICULTY.BUILDING_UPGRADE_COST_MULTIPLIER);
  }

  private getRepairCost() {
    const damaged = 1 - (this.live.health / this.live.maxHealth);
    let cost = this.getMeta().Cost;

    for (let i = 1; i < this.upgradeLevel; i++) {
      cost += this.getUpgradeCost(i);
    }

    return Math.ceil(cost * damaged * DIFFICULTY.BUILDING_REPAIR_COST_MULTIPLIER);
  }

  private isUpgradeAllowed() {
    return this.upgradeLevel < this.getMeta().MaxLevel;
  }

  private getUpgradeAllowedByWave() {
    return (this.getMeta().AllowByWave ?? 1) + this.upgradeLevel;
  }

  private upgrade() {
    if (!this.isUpgradeAllowed()) {
      return;
    }

    const waveNumber = this.getUpgradeAllowedByWave();

    if (waveNumber > this.scene.wave.number) {
      this.scene.game.screen.failure('BUILDING_WILL_BE_AVAILABLE', [waveNumber]);

      return;
    }

    const cost = this.getUpgradeCost();

    if (this.scene.player.resources < cost) {
      this.scene.game.screen.failure('NOT_ENOUGH_RESOURCES');

      return;
    }

    this.upgradeLevel++;

    this.addUpgradeIcon();
    this.updateActionArea();
    this.updateIndicatorsPosition();
    this.upgradeHealth();
    this.setFrame(this.upgradeLevel - 1);

    this.emit(BuildingEvents.UPGRADE);
    this.scene.getEntitiesGroup(EntityType.BUILDING)
      .emit(BuildingEvents.UPGRADE, this);

    this.scene.player.takeResources(cost);

    const experience = progressionLinear({
      defaultValue: DIFFICULTY.BUILDING_UPGRADE_EXPERIENCE,
      scale: DIFFICULTY.BUILDING_UPGRADE_EXPERIENCE_GROWTH,
      level: this.upgradeLevel,
    });

    this.scene.player.giveExperience(experience);

    this.scene.game.sound.play(BuildingAudio.UPGRADE);

    if (Tutorial.IsInProgress(TutorialStep.UPGRADE_BUILDING)) {
      Tutorial.Complete(TutorialStep.UPGRADE_BUILDING);
      if (!this.scene.wave.isGoing) {
        Tutorial.Start(TutorialStep.SKIP_TIMELEFT);
      }
    }
  }

  private repair(auto?: boolean) {
    if (this.live.isMaxHealth()) {
      if (!auto) {
        this.scene.game.screen.failure();
      }

      return;
    }

    const cost = this.getRepairCost();

    if (this.scene.player.resources < cost) {
      if (!auto) {
        this.scene.game.screen.failure('NOT_ENOUGH_RESOURCES');
      }

      return;
    }

    this.live.heal();

    this.updateTileCost();

    this.scene.player.takeResources(cost);

    this.scene.sound.play(BuildingAudio.REPAIR);
  }

  private upgradeHealth() {
    const maxHealth = this.getMaxHealth();

    const addedHealth = maxHealth - this.live.maxHealth;

    this.live.setMaxHealth(maxHealth);
    this.live.addHealth(addedHealth);

    this.updateTileCost();
  }

  private getMaxHealth() {
    return progressionQuadratic({
      defaultValue: this.defaultHealth,
      scale: DIFFICULTY.BUILDING_HEALTH_GROWTH,
      level: this.upgradeLevel,
      roundTo: 100,
    });
  }

  private addIndicatorsContainer() {
    this.indicators = this.scene.add.container();

    this.updateIndicatorsPosition();

    this.indicators.setDepth(WORLD_DEPTH_GRAPHIC);
    this.indicators.setActive(false);
    this.indicators.setVisible(false);
  }

  private updateIndicatorsPosition() {
    const position = this.getTopEdgePosition();

    this.indicators.setPosition(
      position.x - (BUILDING_TILE.width / 4),
      position.y - 3,
    );
  }

  public addIndicator(data: IndicatorData) {
    const indicator = new Indicator(this, data);

    indicator.setPosition(0, this.indicators.length * -5);

    this.indicators.add(indicator);
  }

  public toggleIndicators() {
    const isActive = (
      !this.isSelected
      && this.active
      && this.scene.isModeActive(WorldMode.BUILDING_INDICATORS)
    );

    this.indicators.setActive(isActive);
    this.indicators.setVisible(isActive);
  }

  private updateIndicators() {
    if (!this.indicators.visible) {
      return;
    }

    this.indicators.each((indicator: IIndicator) => {
      indicator.updateValue();
    });
  }

  private removeIndicatorsContainer() {
    this.indicators.destroy();
  }

  public bindTutorialHint(step: TutorialStep, label: LangPhrase, condition?: () => boolean) {
    let hintId: Nullable<string> = null;

    const hideHint = () => {
      if (hintId) {
        this.scene.hideHint(hintId);
        hintId = null;
      }
    };

    const unbindStep = Tutorial.Bind(step, {
      beg: () => {
        if (!condition || condition()) {
          hintId = this.scene.showHint({
            side: 'top',
            label,
            position: this.getBottomEdgePosition(),
            unique: true,
          });
        }
      },
      end: hideHint,
    });

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      hideHint();
      unbindStep();
    });
  }

  private onDamage() {
    this.updateTileCost();

    const audio = Phaser.Utils.Array.GetRandom([
      BuildingAudio.DAMAGE_1,
      BuildingAudio.DAMAGE_2,
    ]);

    if (this.scene.game.sound.getAll(audio).length === 0) {
      this.scene.game.sound.play(audio);
    }

    this.scene.fx.createDamageEffect(this);

    if (
      this.scene.isModeActive(WorldMode.AUTO_REPAIR)
      && this.live.health / this.live.maxHealth <= 0.5
    ) {
      this.repair(true);
    }
  }

  private onDead() {
    this.break();
  }

  private focus() {
    this.toFocus = true;

    if (
      !this.isFocused
      && !this.scene.player.live.isDead()
      && !this.scene.builder.isBuild
    ) {
      this.isFocused = true;
    }
  }

  private unfocus() {
    this.toFocus = false;
    this.isFocused = false;
  }

  public getTopEdgePosition() {
    return {
      x: this.x,
      y: this.y - BUILDING_TILE.height * 0.5,
    };
  }

  public getBottomEdgePosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public addAlertIcon() {
    if (this.alertIcon) {
      return;
    }

    const position = this.getTopEdgePosition();

    this.alertIcon = this.scene.add.image(position.x, position.y, BuildingIcon.ALERT);
    this.alertIcon.setDepth(this.depth + 1);

    this.alertTween = this.scene.tweens.add({
      targets: this.alertIcon,
      alpha: { from: 1.0, to: 0.0 },
      duration: 500,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    });
  }

  public removeAlertIcon() {
    if (!this.alertIcon) {
      return;
    }

    this.alertIcon.destroy();
    this.alertIcon = null;

    this.alertTween?.destroy();
    this.alertTween = null;
  }

  private addUpgradeIcon() {
    if (this.upgradeIcon) {
      this.removeUpgradeIcon();
    }

    const position = this.getTopEdgePosition();

    this.upgradeIcon = this.scene.add.image(position.x, position.y, BuildingIcon.UPGRADE);
    this.upgradeIcon.setDepth(this.depth + 1);

    this.upgradeTween = this.scene.tweens.add({
      targets: this.upgradeIcon,
      y: { from: position.y, to: position.y - 32 },
      alpha: { from: 1.0, to: 0.0 },
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        this.removeUpgradeIcon();
      },
    });
  }

  private removeUpgradeIcon() {
    if (!this.upgradeIcon) {
      return;
    }

    this.upgradeIcon.destroy();
    this.upgradeIcon = null;

    this.upgradeTween?.destroy();
    this.upgradeTween = null;
  }

  public select() {
    if (
      this.isSelected
      || !this.active
      || this.scene.player.live.isDead()
      || this.scene.builder.isBuild
    ) {
      return;
    }

    // Need for fix events order
    if (this.scene.builder.selectedBuilding) {
      this.scene.builder.selectedBuilding.unselect();
    }

    this.scene.builder.selectedBuilding = this;
    this.isSelected = true;

    this.toggleIndicators();

    if (this.actionsArea) {
      this.actionsArea.setVisible(true);
    }

    this.scene.events.emit(WorldEvents.SELECT_BUILDING, this);
  }

  public unselect() {
    if (!this.isSelected) {
      return;
    }

    this.scene.builder.selectedBuilding = null;
    this.isSelected = false;

    this.toggleIndicators();

    if (this.actionsArea) {
      this.actionsArea.setVisible(false);
    }

    this.scene.events.emit(WorldEvents.UNSELECT_BUILDING, this);
  }

  private setOutline(state: BuildingOutlineState) {
    if (this.outlineState === state) {
      return;
    }

    if (state === BuildingOutlineState.NONE) {
      this.removeShader(ShaderType.OUTLINE);
    } else {
      const params = {
        [BuildingOutlineState.FOCUSED]: { size: 3.0, color: 0xffffff },
        [BuildingOutlineState.SELECTED]: { size: 4.0, color: 0xd0ff4f },
      }[state];

      if (this.outlineState === BuildingOutlineState.NONE) {
        this.addShader(ShaderType.OUTLINE, params);
      } else {
        this.updateShader(ShaderType.OUTLINE, params);
      }
    }

    this.outlineState = state;
  }

  private updateOutline() {
    let outlineState = BuildingOutlineState.NONE;

    if (this.isSelected) {
      outlineState = BuildingOutlineState.SELECTED;
    } else if (this.isFocused) {
      outlineState = BuildingOutlineState.FOCUSED;
    }

    this.setOutline(outlineState);
  }

  private addActionArea() {
    if (!this.radius || this.actionsArea) {
      return;
    }

    const position = this.getBottomEdgePosition();

    this.actionsArea = this.scene.add.ellipse(position.x, position.y);
    this.actionsArea.setFillStyle(0xffffff, 0.3);
    this.actionsArea.setVisible(false);

    this.updateActionArea();

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.actionsArea) {
        this.actionsArea.destroy();
        this.actionsArea = null;
      }
    });
  }

  public updateActionArea() {
    if (!this.actionsArea) {
      return;
    }

    const d = this.getActionsRadius() * 2;

    this.actionsArea.setSize(d, d * LEVEL_MAP_PERSPECTIVE);
    this.actionsArea.updateDisplayOrigin();
  }

  private removeActionArea() {
    if (!this.actionsArea) {
      return;
    }

    this.actionsArea.destroy();
    this.actionsArea = null;
  }

  public break() {
    this.scene.sound.play(BuildingAudio.DEAD);
    this.scene.fx.createSmokeEffect(this);

    const group = this.scene.getEntitiesGroup(EntityType.BUILDING);

    this.destroy();

    group.emit(BuildingEvents.BREAK, this);
  }

  private startBuildProcess(duration: number) {
    this.addBuildBar();
    this.addBuildTimer(duration);

    this.setActive(false);
    this.setAlpha(0.5);
  }

  private completeBuildProcess() {
    this.stopBuildProcess();

    this.setActive(true);
    this.setAlpha(1.0);

    this.toggleIndicators();

    this.setInteractive({
      pixelPerfect: true,
      useHandCursor: true,
    });

    this.scene.getEntitiesGroup(EntityType.BUILDING)
      .emit(BuildingEvents.CREATE, this);
  }

  private stopBuildProcess() {
    this.removeBuildBar();
    this.removeBuildTimer();
  }

  private addBuildTimer(duration: number) {
    this.buildTimer = this.scene.addProgression({
      duration,
      onProgress: (left: number, total: number) => {
        const progress = 1 - (left / total);

        this.setAlpha(0.5 + (progress / 2));
        this.buildBar?.updateValue(progress);
      },
      onComplete: () => {
        this.completeBuildProcess();
      },
    });
  }

  private removeBuildTimer() {
    if (!this.buildTimer) {
      return;
    }

    this.scene.removeProgression(this.buildTimer);
    this.buildTimer = null;
  }

  private addBuildBar() {
    if (this.buildBar) {
      return;
    }

    this.buildBar = new Indicator(this, {
      size: BUILDING_TILE.width / 2,
      color: 0xffffff,
    });

    const position = this.getTopEdgePosition();

    this.buildBar.setPosition(
      position.x - this.buildBar.width / 2,
      position.y - 3,
    );
  }

  private removeBuildBar() {
    if (!this.buildBar) {
      return;
    }

    this.buildBar.destroy();
    this.buildBar = null;
  }

  public bindHotKey(key: string, callback: () => void) {
    if (!this.scene.game.isDesktop()) {
      return;
    }

    const handler = () => {
      if (
        this.isSelected
        || (this.isFocused && this.scene.builder.selectedBuilding === null)
      ) {
        callback();
      }
    };

    this.scene.input.keyboard?.on(key, handler);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.input.keyboard?.off(key, handler);
    });
  }

  private handleToggleModes() {
    const handler = (mode: WorldMode) => {
      switch (mode) {
        case WorldMode.BUILDING_INDICATORS: {
          this.toggleIndicators();
          break;
        }
      }
    };

    this.scene.events.on(WorldEvents.TOGGLE_MODE, handler);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(WorldEvents.TOGGLE_MODE, handler);
    });
  }

  private handlePointer() {
    let preventClick = false;

    const handleClick = (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        this.select();
        preventClick = true;
      }
    };

    const handleOutsideClick = () => {
      if (preventClick) {
        preventClick = false;
      } else {
        this.unselect();
      }
    };

    const handleClear = () => {
      this.unfocus();
      this.unselect();
    };

    const handleStop = () => {
      handleClear();
      this.setActive(false);
    };

    this.on(Phaser.Input.Events.POINTER_DOWN, handleClick);

    if (this.scene.game.isDesktop()) {
      this.on(Phaser.Input.Events.POINTER_OVER, this.focus, this);
      this.on(Phaser.Input.Events.POINTER_OUT, this.unfocus, this);
    }

    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, handleOutsideClick);
    this.scene.game.events.on(GameEvents.FINISH, handleStop);
    this.scene.builder.on(BuilderEvents.BUILD_START, handleClear);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, handleOutsideClick);
      this.scene.game.events.off(GameEvents.FINISH, handleStop);
      this.scene.builder.off(BuilderEvents.BUILD_START, handleClear);
    });
  }

  public getSavePayload(): BuildingSavePayload {
    return {
      variant: this.variant,
      position: this.positionAtMatrix,
      health: this.live.health,
      upgradeLevel: this.upgradeLevel,
    };
  }

  public loadSavePayload(data: BuildingSavePayload) {
    if (data.upgradeLevel > 1) {
      this.upgradeLevel = Math.min(data.upgradeLevel, this.getMeta().MaxLevel);

      this.updateIndicatorsPosition();
      this.updateActionArea();
      this.setFrame(this.upgradeLevel - 1);

      this.live.setMaxHealth(this.getMaxHealth());

      this.emit(BuildingEvents.UPGRADE);
      this.scene.getEntitiesGroup(EntityType.BUILDING)
        .emit(BuildingEvents.UPGRADE, this);
    }

    this.live.setHealth(data.health);

    this.updateTileCost();
  }
}

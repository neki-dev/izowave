import Phaser from 'phaser';

import type { WorldScene } from '../..';
import type { Particles } from '../../fx-manager/particles';
import type { IParticlesParent } from '../../fx-manager/particles/types';
import { Indicator } from '../addons/indicator';
import type { IndicatorData } from '../addons/indicator/types';
import { Live } from '../addons/live';
import { LiveEvent } from '../addons/live/types';
import type { IEnemyTarget } from '../npc/enemy/types';
import type { IShotInitiator } from '../shot/types';
import { EntityType } from '../types';

import { BUILDING_HEALTH_GROWTH, BUILDING_REPAIR_COST_MULTIPLIER, BUILDING_TILE, BUILDING_TILE_COST_MULTIPLIER, BUILDING_UPGRADE_COST_MULTIPLIER, BUILDING_UPGRADE_EXPERIENCE, BUILDING_UPGRADE_EXPERIENCE_GROWTH } from './const';
import type { IBuildingFactory } from './factory/types';
import type {
  BuildingData,
  BuildingParam,
  BuildingControl,
  BuildingGrowthValue,
  BuildingSavePayload,
  BuildingVariant,
} from './types';
import {
  BuildingEvent,
  BuildingAudio,
  BuildingIcon,
  BuildingOutlineState,
} from './types';

import { CONTROL_KEY } from '~core/controls/const';
import type { LangPhrase } from '~core/lang/types';
import { progressionLinear, progressionQuadratic } from '~core/progression';
import { ShaderType } from '~core/shader/types';
import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import { GameEvent } from '~game/types';
import { BuilderEvent } from '~scene/world/builder/types';
import { WORLD_DEPTH_GRAPHIC } from '~scene/world/const';
import { Level } from '~scene/world/level';
import { LEVEL_MAP_PERSPECTIVE } from '~scene/world/level/const';
import type { ITile } from '~scene/world/level/tile-matrix/types';
import type { PositionAtMatrix, PositionAtWorld } from '~scene/world/level/types';
import { TileType } from '~scene/world/level/types';
import { WorldMode, WorldEvent } from '~scene/world/types';

import './resources';

export abstract class Building extends Phaser.GameObjects.Image implements ITile, IEnemyTarget, IParticlesParent, IShotInitiator {
  declare public readonly scene: WorldScene;

  public readonly live: Live;

  public readonly variant: BuildingVariant;

  public readonly positionAtMatrix: PositionAtMatrix;

  public readonly tileType: TileType = TileType.BUILDING;

  private _upgradeLevel: number = 1;
  public get upgradeLevel() { return this._upgradeLevel; }
  private set upgradeLevel(v) { this._upgradeLevel = v; }

  public effects: Map<string, Particles> = new Map();

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

  private buildBar: Nullable<Indicator> = null;

  private indicators: Phaser.GameObjects.Container;

  constructor(scene: WorldScene, {
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

    this.live.on(LiveEvent.DAMAGE, this.onDamage.bind(this));
    this.live.on(LiveEvent.DEAD, this.onDead.bind(this));

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
      console.warn('Failed building update', error as TypeError);
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

  protected pauseActions() {
    if (!this.delay) {
      return;
    }

    this.nextActionTimestamp = this.scene.getTime() + this.getActionsDelay();
  }

  protected isActionAllowed() {
    if (!this.delay) {
      return true;
    }

    return this.nextActionTimestamp < this.scene.getTime();
  }

  private updateTileCost() {
    const cost = 2.0 + Number((this.live.maxHealth * BUILDING_TILE_COST_MULTIPLIER).toFixed(1));

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

  protected getActionsRadius() {
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

    return Math.round(costPerLevel * nextLevel * BUILDING_UPGRADE_COST_MULTIPLIER);
  }

  private getRepairCost() {
    const damaged = 1 - (this.live.health / this.live.maxHealth);
    let cost = this.getMeta().Cost;

    for (let i = 1; i < this.upgradeLevel; i++) {
      cost += this.getUpgradeCost(i);
    }

    return Math.ceil(cost * damaged * BUILDING_REPAIR_COST_MULTIPLIER);
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

    this.emit(BuildingEvent.UPGRADE);
    this.scene.getEntitiesGroup(EntityType.BUILDING)
      .emit(BuildingEvent.UPGRADE, this);

    this.scene.player.takeResources(cost);

    const experience = progressionLinear({
      defaultValue: BUILDING_UPGRADE_EXPERIENCE,
      scale: BUILDING_UPGRADE_EXPERIENCE_GROWTH,
      level: this.upgradeLevel,
    });

    this.scene.player.giveExperience(experience);

    this.scene.fx.playSound(BuildingAudio.UPGRADE);

    if (Tutorial.IsInProgress(TutorialStep.UPGRADE_BUILDING)) {
      Tutorial.Complete(TutorialStep.UPGRADE_BUILDING);
      if (!this.scene.wave.going) {
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

    this.scene.fx.playSound(BuildingAudio.REPAIR);
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
      scale: BUILDING_HEALTH_GROWTH,
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

  protected addIndicator(data: IndicatorData) {
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

    this.indicators.each((indicator: Indicator) => {
      indicator.updateValue();
    });
  }

  private removeIndicatorsContainer() {
    this.indicators.destroy();
  }

  protected bindTutorialHint(step: TutorialStep, label: LangPhrase, condition?: () => boolean) {
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

    this.scene.fx.createDamageEffect(this);
    this.scene.fx.playSound([
      BuildingAudio.DAMAGE_1,
      BuildingAudio.DAMAGE_2,
    ], {
      limit: 1,
    });

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

  protected addAlertIcon() {
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

  protected removeAlertIcon() {
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

    this.scene.events.emit(WorldEvent.SELECT_BUILDING, this);
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

    this.scene.events.emit(WorldEvent.UNSELECT_BUILDING, this);
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

  protected updateActionArea() {
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
    this.scene.fx.playSound(BuildingAudio.DEAD);
    this.scene.fx.createSmokeEffect(this);

    const group = this.scene.getEntitiesGroup(EntityType.BUILDING);

    this.destroy();

    group.emit(BuildingEvent.BREAK, this);
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
      .emit(BuildingEvent.CREATE, this);
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

  protected bindHotKey(key: string, callback: () => void) {
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

    this.scene.events.on(WorldEvent.TOGGLE_MODE, handler);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(WorldEvent.TOGGLE_MODE, handler);
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
    this.scene.game.events.on(GameEvent.FINISH, handleStop);
    this.scene.builder.on(BuilderEvent.BUILD_START, handleClear);

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, handleOutsideClick);
      this.scene.game.events.off(GameEvent.FINISH, handleStop);
      this.scene.builder.off(BuilderEvent.BUILD_START, handleClear);
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

      this.emit(BuildingEvent.UPGRADE);
      this.scene.getEntitiesGroup(EntityType.BUILDING)
        .emit(BuildingEvent.UPGRADE, this);
    }

    this.live.setHealth(data.health);

    this.updateTileCost();
  }
}

import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { WORLD_DEPTH_EFFECT, WORLD_DEPTH_GRAPHIC } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_PATH_COST } from '~const/world/entities/building';
import { LEVEL_TILE_SIZE } from '~const/world/level';
import { Indicator } from '~entity/indicator';
import { Assets } from '~lib/assets';
import { progressionQuadratic, progressionLinear } from '~lib/difficulty';
import { Live } from '~lib/live';
import { Tutorial } from '~lib/tutorial';
import { Effect } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { GameEvents, GameSettings } from '~type/game';
import { ILive, LiveEvents } from '~type/live';
import { NoticeType } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { IWorld, WorldEvents } from '~type/world';
import { BuilderEvents } from '~type/world/builder';
import { EffectTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import {
  BuildingData, BuildingEvents, BuildingAudio,
  BuildingTexture, BuildingVariant, BuildingParam, BuildingControl,
  BuildingOutlineState, IBuildingFactory, IBuilding, BuildingIcon, BuildingGrowthValue, BuildingSavePayload,
} from '~type/world/entities/building';
import { IIndicator, IndicatorData } from '~type/world/entities/indicator';
import { TileType, Vector2D } from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

Assets.RegisterAudio(BuildingAudio);
Assets.RegisterImages(BuildingIcon);
Assets.RegisterSprites(BuildingTexture, {
  width: LEVEL_TILE_SIZE.width,
  height: LEVEL_TILE_SIZE.height,
});

export class Building extends Phaser.GameObjects.Image implements IBuilding, ITile {
  readonly scene: IWorld;

  readonly live: ILive;

  readonly variant: BuildingVariant;

  readonly positionAtMatrix: Vector2D;

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
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);

    super(scene, positionAtWorld.x, positionAtWorld.y, texture);
    scene.addEntity(EntityType.BUILDING, this);

    this.radius = radius ?? null;
    this.delay = delay ?? null;
    this.defaultHealth = health;
    this.variant = variant;
    this.positionAtMatrix = positionAtMatrix;
    this.live = new Live({ health });

    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.setOrigin(0.5, LEVEL_TILE_SIZE.origin);
    this.scene.level.putTile(this, tilePosition);

    this.addActionArea();
    this.addIndicatorsContainer();
    this.addIndicator({
      color: 0xd0ff4f,
      size: LEVEL_TILE_SIZE.width / 2,
      value: () => this.live.health / this.live.maxHealth,
    });

    this.handlePointer();

    this.scene.builder.addFoundation(positionAtMatrix);

    if (buildDuration && buildDuration > 0) {
      this.startBuildProcess(buildDuration);
    } else {
      setTimeout(() => {
        this.completeBuildProcess();
      }, 0);
    }

    this.scene.level.navigator.setPointCost(positionAtMatrix, BUILDING_PATH_COST);

    this.bindHotKey(CONTROL_KEY.BUILDING_REPEAR, () => this.repair());
    this.bindHotKey(CONTROL_KEY.BUILDING_UPGRADE, () => this.upgrade());
    this.bindHotKey(CONTROL_KEY.BUILDING_DESTROY, () => this.break());

    this.live.on(LiveEvents.DAMAGE, this.onDamage.bind(this));
    this.live.on(LiveEvents.DEAD, this.onDead.bind(this));

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.stopBuildProcess();

      this.removeIndicatorsContainer();
      this.removeAlertIcon();
      this.removeUpgradeIcon();

      this.unfocus();
      this.unselect();

      this.scene.level.navigator.resetPointCost(positionAtMatrix);
      this.live.removeAllListeners();

      this.scene.getEntitiesGroup(EntityType.BUILDING)
        .emit(BuildingEvents.BREAK, this);
    });
  }

  public update() {
    this.updateOutline();
    this.updateIndicators();

    // Catch focus by camera moving
    if (this.toFocus) {
      this.focus();
    }
  }

  public actionsAreaContains(position: Vector2D) {
    if (!this.active || !this.actionsArea) {
      return false;
    }

    const offset = this.actionsArea.getTopLeft() as Vector2D;
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

  public getInfo() {
    const info: BuildingParam[] = [];
    const delay = this.getActionsDelay();

    if (delay) {
      info.push({
        label: 'Delay',
        icon: BuildingIcon.DELAY,
        value: `${delay / 1000} s`,
      });
    }

    return info;
  }

  public getControls() {
    const actions: BuildingControl[] = [];

    if (this.isUpgradeAllowed()) {
      actions.push({
        label: 'Upgrade',
        cost: this.getUpgradeCost(),
        disabled: this.getUpgradeAllowedByWave() > this.scene.wave.number,
        hotkey: 'E',
        onClick: () => {
          this.upgrade();
        },
      });
    }

    actions.push({
      label: 'Repair',
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
    const costPerLevel = this.getMeta().Cost * DIFFICULTY.BUILDING_UPGRADE_COST_MULTIPLIER;
    const nextLevel = level ?? this.upgradeLevel;

    return Math.round(costPerLevel * nextLevel);
  }

  private getRepairCost() {
    const damaged = 1 - (this.live.health / this.live.maxHealth);
    let cost = this.getMeta().Cost;

    for (let i = 1; i < this.upgradeLevel; i++) {
      cost += this.getUpgradeCost(i);
    }

    return Math.ceil(cost * damaged);
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
      this.scene.game.screen.notice(NoticeType.ERROR, `Will be available on ${waveNumber} wave`);

      return;
    }

    const cost = this.getUpgradeCost();

    if (this.scene.player.resources < cost) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'Not enough resources');

      return;
    }

    this.upgradeLevel++;

    this.addUpgradeIcon();
    this.updateActionArea();
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

    Tutorial.Complete(TutorialStep.UPGRADE_BUILDING);
    this.scene.game.sound.play(BuildingAudio.UPGRADE);
  }

  private repair() {
    if (this.live.isMaxHealth()) {
      return;
    }

    const cost = this.getRepairCost();

    if (this.scene.player.resources < cost) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'Not enough resources');

      return;
    }

    this.live.heal();

    this.scene.player.takeResources(cost);

    this.scene.sound.play(BuildingAudio.REPAIR);
  }

  private upgradeHealth() {
    const maxHealth = this.getMaxHealth();

    const addedHealth = maxHealth - this.live.maxHealth;

    this.live.setMaxHealth(maxHealth);
    this.live.addHealth(addedHealth);
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
    this.indicators = this.scene.add.container(this.x - (LEVEL_TILE_SIZE.width / 4), this.y - 6);

    this.indicators.setDepth(WORLD_DEPTH_GRAPHIC);
    this.indicators.setActive(false);
    this.indicators.setVisible(false);
  }

  public addIndicator(data: IndicatorData) {
    const indicator = new Indicator(this, data);

    indicator.setPosition(0, this.indicators.length * -6);

    this.indicators.add(indicator);
  }

  public toggleIndicators() {
    const isActive = !this.isSelected && this.active && this.scene.isIndicatorsActive;

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

  public bindTutorialHint(step: TutorialStep, text: string, condition?: () => boolean) {
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
            text,
            position: this.getPositionOnGround(),
            unique: true,
          });
        }
      },
      end: hideHint,
    });

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      hideHint();
      unbindStep();
    });
  }

  private onDamage() {
    const audio = Phaser.Utils.Array.GetRandom([
      BuildingAudio.DAMAGE_1,
      BuildingAudio.DAMAGE_2,
    ]);

    if (this.scene.game.sound.getAll(audio).length === 0) {
      this.scene.game.sound.play(audio);
    }

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Effect(this.scene, {
        texture: EffectTexture.DAMAGE,
        position: this.getTopCenterByLevel(),
        depth: this.depth + 1,
        rate: 14,
      });
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

  public getPositionOnGround() {
    return {
      x: this.x,
      y: this.y + LEVEL_TILE_SIZE.height * 0.5,
    };
  }

  public addAlertIcon() {
    if (this.alertIcon) {
      return;
    }

    this.alertIcon = this.scene.add.image(this.x, this.y, BuildingIcon.ALERT);
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

    this.upgradeIcon = this.scene.add.image(this.x, this.y, BuildingIcon.UPGRADE);
    this.upgradeIcon.setDepth(this.depth + 1);

    this.upgradeTween = this.scene.tweens.add({
      targets: this.upgradeIcon,
      y: { from: this.y, to: this.y - 32 },
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

  public getTopCenterByLevel() {
    return {
      x: this.x,
      y: this.y - 6,
    };
  }

  private setOutline(state: BuildingOutlineState) {
    if (this.outlineState === state) {
      return;
    }

    if (state === BuildingOutlineState.NONE) {
      this.removeShader('OutlineShader');
    } else {
      const params = {
        [BuildingOutlineState.FOCUSED]: { size: 4.0, color: 0xffffff },
        [BuildingOutlineState.SELECTED]: { size: 4.0, color: 0xd0ff4f },
      }[state];

      if (this.outlineState === BuildingOutlineState.NONE) {
        this.addShader('OutlineShader', params);
      } else {
        this.updateShader('OutlineShader', params);
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

    const position = this.getPositionOnGround();

    this.actionsArea = this.scene.add.ellipse(position.x, position.y);
    this.actionsArea.setDepth(WORLD_DEPTH_EFFECT);
    this.actionsArea.setFillStyle(0xffffff, 0.35);
    this.actionsArea.setVisible(false);

    this.updateActionArea();

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.actionsArea) {
        this.actionsArea.destroy();
        this.actionsArea = null;
      }
    });
  }

  private updateActionArea() {
    if (!this.actionsArea) {
      return;
    }

    const d = this.getActionsRadius() * 2;

    this.actionsArea.setSize(d, d * LEVEL_TILE_SIZE.persperctive);
    this.actionsArea.updateDisplayOrigin();
  }

  public break() {
    this.scene.sound.play(BuildingAudio.DEAD);

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Effect(this.scene, {
        texture: EffectTexture.SMOKE,
        position: this.getPositionOnGround(),
        depth: this.depth + 1,
        rate: 18,
      });
    }

    this.destroy();
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
    const target = duration / 50;
    let progress = 0;

    this.buildTimer = this.scene.time.addEvent({
      delay: 50,
      repeat: target,
      callback: () => {
        progress++;

        this.setAlpha(this.alpha + (0.5 / target));

        if (progress >= target) {
          this.completeBuildProcess();
        } else {
          this.buildBar?.updateValue(progress / target);
        }
      },
    });
  }

  private removeBuildTimer() {
    if (!this.buildTimer) {
      return;
    }

    this.buildTimer.destroy();
    this.buildTimer = null;
  }

  private addBuildBar() {
    if (this.buildBar) {
      return;
    }

    this.buildBar = new Indicator(this, {
      size: 20,
      color: 0xffffff,
    });

    this.buildBar.setPosition(this.x - this.buildBar.width / 2, this.y + 20);
  }

  private removeBuildBar() {
    if (!this.buildBar) {
      return;
    }

    this.buildBar.destroy();
    this.buildBar = null;
  }

  public bindHotKey(key: string, callback: () => void) {
    const handler = (event: KeyboardEvent) => {
      if (
        this.isSelected
        || (this.isFocused && this.scene.builder.selectedBuilding === null)
      ) {
        callback();
        event.preventDefault();
      }
    };

    this.scene.input.keyboard?.on(key, handler);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.input.keyboard?.off(key, handler);
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

    this.on(Phaser.Input.Events.POINTER_DOWN, handleClick);

    if (this.scene.game.device.os.desktop) {
      this.on(Phaser.Input.Events.POINTER_OVER, this.focus, this);
      this.on(Phaser.Input.Events.POINTER_OUT, this.unfocus, this);
    }

    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, handleOutsideClick);
    this.scene.game.events.on(GameEvents.FINISH, handleClear);
    this.scene.builder.on(BuilderEvents.BUILD_START, handleClear);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, handleOutsideClick);
      this.scene.game.events.off(GameEvents.FINISH, handleClear);
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

      this.updateActionArea();
      this.setFrame(this.upgradeLevel - 1);

      this.live.setMaxHealth(this.getMaxHealth());

      this.emit(BuildingEvents.UPGRADE);
      this.scene.getEntitiesGroup(EntityType.BUILDING)
        .emit(BuildingEvents.UPGRADE, this);
    }

    this.live.setHealth(data.health);
  }
}

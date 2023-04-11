import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { LEVEL_BUILDING_PATH_COST, TILE_META } from '~const/world/level';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { Effect } from '~scene/world/effects';
import { Hexagon } from '~scene/world/hexagon';
import { Level } from '~scene/world/level';
import { Live } from '~scene/world/live';
import { GameEvents } from '~type/game';
import { NoticeType } from '~type/screen';
import { TutorialStep } from '~type/tutorial';
import { IWorld, WorldEvents } from '~type/world';
import { BuilderEvents } from '~type/world/builder';
import { EffectTexture } from '~type/world/effects';
import {
  BuildingActionsParams, BuildingData, BuildingEvents, BuildingAudio,
  BuildingTexture, BuildingVariant, BuildingParam, BuildingControl,
  BuildingOutlineState, IBuildingFactory, BuildingIcon, IBuilding,
} from '~type/world/entities/building';
import { ILive, LiveEvents } from '~type/world/entities/live';
import { TileType, Vector2D } from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

export class Building extends Phaser.GameObjects.Image implements IBuilding, ITile {
  readonly scene: IWorld;

  readonly live: ILive;

  readonly variant: BuildingVariant;

  readonly positionAtMatrix: Vector2D;

  readonly tileType: TileType = TileType.BUILDING;

  private _upgradeLevel: number = 1;

  public get upgradeLevel() { return this._upgradeLevel; }

  private set upgradeLevel(v) { this._upgradeLevel = v; }

  private actions: Nullable<BuildingActionsParams>;

  private nextActionTimestamp: number = 0;

  private outlineState: BuildingOutlineState = BuildingOutlineState.NONE;

  private outlineTween: Nullable<Phaser.Tweens.Tween> = null;

  private actionsArea: Nullable<Phaser.GameObjects.Ellipse> = null;

  public hasAlert: boolean = false;

  private _isFocused: boolean = false;

  public get isFocused() { return this._isFocused; }

  private set isFocused(v) { this._isFocused = v; }

  private toFocus: boolean = false;

  private isSelected: boolean = false;

  constructor(scene: IWorld, {
    positionAtMatrix, health, texture, variant, actions = null,
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

    this.scene.builder.addFoundation(positionAtMatrix);

    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.setOrigin(0.5, TILE_META.origin);
    this.scene.level.putTile(this, tilePosition);

    this.scene.level.navigator.setPointCost(positionAtMatrix, LEVEL_BUILDING_PATH_COST);

    this.scene.input.keyboard.on(CONTROL_KEY.BUILDING_DESTROY, () => {
      if (this.isFocused) {
        this.break();
      }
    });
    this.scene.input.keyboard.on(CONTROL_KEY.BUILDING_UPGRADE, () => {
      if (this.isFocused) {
        this.upgrade();
      }
    });
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (this.isFocused) {
        this.onClick();
      } else {
        this.onUnclick();
      }
    });
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.onFocus();
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.onUnfocus();
    });

    this.live.on(LiveEvents.DAMAGE, () => {
      this.onDamage();
    });
    this.live.on(LiveEvents.DEAD, () => {
      this.onDead();
    });
    this.scene.game.events.on(GameEvents.FINISH, () => {
      this.onUnfocus();
      this.onUnclick();
    });
    this.scene.builder.on(BuilderEvents.BUILD_START, () => {
      this.onUnfocus();
      this.onUnclick();
    });
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.onUnfocus();
      this.onUnclick();
      this.scene.level.navigator.resetPointCost(positionAtMatrix);
    });
  }

  public setInteractive() {
    const shape = new Hexagon(0, 0, TILE_META.height * 0.5);

    return super.setInteractive(shape, Hexagon.Contains);
  }

  public update() {
    this.updateOutline();

    if (this.toFocus) {
      this.onFocus();
    }
  }

  public actionsAreaContains(position: Vector2D) {
    if (!this.actionsArea) {
      return false;
    }

    const offset = this.actionsArea.getTopLeft();
    const contains: boolean = this.actionsArea.geom.contains(position.x - offset.x, position.y - offset.y);

    return contains;
  }

  public pauseActions() {
    if (!this.actions?.pause) {
      return;
    }

    this.nextActionTimestamp = this.scene.getTime() + this.getActionsPause();
  }

  public isAllowAction() {
    if (!this.actions?.pause) {
      return true;
    }

    return (this.nextActionTimestamp < this.scene.getTime());
  }

  public getInfo() {
    return [{
      label: 'HEALTH',
      icon: BuildingIcon.HEALTH,
      value: this.live.health,
    }] as BuildingParam[];
  }

  public getControls() {
    const actions: BuildingControl[] = [];

    if (this.isAllowUpgrade()) {
      actions.push({
        label: 'UPGRADE',
        cost: this.getUpgradeLevelCost(),
        onClick: () => {
          this.upgrade();
        },
      });
    }

    return actions;
  }

  public getMeta() {
    return this.constructor as IBuildingFactory;
  }

  public getActionsRadius() {
    return this.actions?.radius
      ? calcGrowth(
        this.actions.radius,
        DIFFICULTY.BUILDING_ACTION_RADIUS_GROWTH,
        this.upgradeLevel,
      )
      : 0;
  }

  private getActionsPause() {
    return this.actions?.pause
      ? calcGrowth(
        this.actions.pause,
        DIFFICULTY.BUILDING_ACTION_PAUSE_GROWTH,
        this.upgradeLevel,
      )
      : 0;
  }

  private getUpgradeLevelCost() {
    const costPerLevel = this.getMeta().Cost / BUILDING_MAX_UPGRADE_LEVEL;

    return Math.round(this.upgradeLevel * costPerLevel);
  }

  private isAllowUpgrade() {
    return (this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL && !this.scene.wave.isGoing);
  }

  /**
   * Upgrade building to next level.
   */
  private upgrade() {
    if (!this.isAllowUpgrade()) {
      return;
    }

    const waveAllowed = this.getWaveAllowUpgrade();

    if (waveAllowed > this.scene.wave.number) {
      this.scene.game.screen.notice(NoticeType.ERROR, `UPGRADE WILL BE AVAILABLE ON ${waveAllowed} WAVE`);

      return;
    }

    const cost = this.getUpgradeLevelCost();

    if (this.scene.player.resources < cost) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

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
    this.scene.game.screen.notice(NoticeType.INFO, 'BUILDING UPGRADED');

    this.scene.game.tutorial.end(TutorialStep.UPGRADE_BUILDING);
  }

  private getWaveAllowUpgrade() {
    return (this.getMeta().AllowByWave || 1) + this.upgradeLevel;
  }

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

  private onDead() {
    this.scene.game.screen.notice(NoticeType.WARN, `${this.getMeta().Name} HAS BEEN DESTROYED`);

    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.SMOKE,
        audio: BuildingAudio.DEAD,
        position: {
          x: this.x,
          y: this.y + TILE_META.height * 0.5,
        },
        rate: 18,
      });
    }

    this.destroy();
  }

  private onFocus() {
    this.toFocus = true;

    if (
      this.isFocused
      || this.scene.player.live.isDead()
      || this.scene.builder.isBuild
    ) {
      return;
    }

    this.isFocused = true;

    this.scene.input.setDefaultCursor('pointer');
  }

  private onUnfocus() {
    this.toFocus = false;

    if (!this.isFocused) {
      return;
    }

    this.isFocused = false;

    this.scene.input.setDefaultCursor('default');
  }

  private onClick() {
    if (!this.isFocused || this.isSelected) {
      return;
    }

    this.isSelected = true;

    if (this.actionsArea) {
      this.actionsArea.setVisible(true);
    }

    this.scene.events.emit(WorldEvents.SELECT_BUILDING, this);
  }

  private onUnclick() {
    if (!this.isSelected) {
      return;
    }

    this.isSelected = false;

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
      this.removeShader('OutlineShader');

      if (this.outlineTween) {
        this.outlineTween.destroy();
        this.outlineTween = null;
      }
    } else {
      const color: number = {
        [BuildingOutlineState.FOCUSED]: 0xffffff,
        [BuildingOutlineState.SELECTED]: 0xd0ff4f,
        [BuildingOutlineState.ALERT]: 0xffa200,
      }[state];

      if (this.outlineState === BuildingOutlineState.NONE) {
        this.addShader('OutlineShader', {
          size: 0.0,
          color,
        });

        this.outlineTween = <Phaser.Tweens.Tween> this.scene.tweens.add({
          targets: this,
          shaderSize: { from: 0.0, to: 3.0 },
          duration: 350,
          ease: 'Linear',
          yoyo: true,
          repeat: -1,
          onUpdate: (_, __, ___, size: number) => {
            this.updateShader('OutlineShader', { size });
          },
        });
      } else {
        this.updateShader('OutlineShader', { color });
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
    } else if (this.hasAlert) {
      outlineState = BuildingOutlineState.ALERT;
    }
    this.setOutline(outlineState);
  }

  private addActionArea() {
    if (!this.actions?.radius || this.actionsArea) {
      return;
    }

    this.actionsArea = this.scene.add.ellipse(this.x, this.y + TILE_META.height * 0.5);
    this.actionsArea.setStrokeStyle(2, 0xffffff, 0.5);
    this.actionsArea.setFillStyle(0xffffff, 0.2);
    this.actionsArea.setVisible(false);

    this.updateActionArea();

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.actionsArea?.destroy();
    });
  }

  private updateActionArea() {
    if (!this.actionsArea) {
      return;
    }

    const { persperctive, height } = TILE_META;
    const d = this.getActionsRadius() * 2;
    const out = height * 2;

    this.actionsArea.setSize(d, d * persperctive);
    this.actionsArea.setDepth(Level.GetDepth(this.y + TILE_META.height * 0.5, 1, d * persperctive + out));
    this.actionsArea.updateDisplayOrigin();
  }

  private break() {
    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.SMOKE,
        audio: BuildingAudio.REMOVE,
        position: {
          x: this.x,
          y: this.y + TILE_META.height * 0.5,
        },
        rate: 18,
      });
    }

    this.destroy();
  }
}

registerAudioAssets(BuildingAudio);
registerSpriteAssets(BuildingTexture, {
  width: TILE_META.width,
  height: TILE_META.height,
});

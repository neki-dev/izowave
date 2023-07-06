import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_MAX_UPGRADE_LEVEL } from '~const/world/entities/building';
import { LEVEL_BUILDING_PATH_COST, LEVEL_TILE_SIZE } from '~const/world/level';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { progressionLinear, progressionQuadratic } from '~lib/utils';
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

  private alertTween: Nullable<Phaser.Tweens.Tween> = null;

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

    this.setInteractiveByShape();
    this.addActionArea();

    this.scene.builder.addFoundation(positionAtMatrix);

    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.setOrigin(0.5, LEVEL_TILE_SIZE.origin);
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
        this.select();
      } else {
        this.unselect();
      }
    });
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.focus();
    });
    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.unfocus();
    });

    this.live.on(LiveEvents.DAMAGE, () => {
      this.onDamage();
    });
    this.live.on(LiveEvents.DEAD, () => {
      this.onDead();
    });
    this.scene.game.events.on(GameEvents.FINISH, () => {
      this.unfocus();
      this.unselect();
    });
    this.scene.builder.on(BuilderEvents.BUILD_START, () => {
      this.unfocus();
      this.unselect();
    });
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.unfocus();
      this.unselect();
      this.scene.level.navigator.resetPointCost(positionAtMatrix);
    });
  }

  public update() {
    this.updateOutline();
    this.updateAlert();

    // Catch focus by camera moving
    if (this.toFocus) {
      this.focus();
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

  public isActionAllowed() {
    if (!this.actions?.pause) {
      return true;
    }

    return (this.nextActionTimestamp < this.scene.getTime());
  }

  public getInfo() {
    const params: BuildingParam[] = [{
      label: 'HEALTH',
      icon: BuildingIcon.HEALTH,
      value: this.live.health,
    }];

    return params;
  }

  public getControls() {
    const actions: BuildingControl[] = [];

    if (this.isUpgradeAllowed()) {
      actions.push({
        label: 'UPGRADE',
        cost: this.getUpgradeCost(),
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
      ? progressionQuadratic(
        this.actions.radius,
        DIFFICULTY.BUILDING_ACTION_RADIUS_GROWTH,
        this.upgradeLevel,
      )
      : 0;
  }

  private getActionsPause() {
    return this.actions?.pause
      ? progressionQuadratic(
        this.actions.pause,
        DIFFICULTY.BUILDING_ACTION_PAUSE_GROWTH,
        this.upgradeLevel,
      )
      : 0;
  }

  public getUpgradeCost() {
    const costPerLevel = this.getMeta().Cost / BUILDING_MAX_UPGRADE_LEVEL;
    const nextLevel = this.upgradeLevel + 1;

    return Math.round(costPerLevel * nextLevel);
  }

  private isUpgradeAllowed() {
    return this.upgradeLevel < BUILDING_MAX_UPGRADE_LEVEL;
  }

  private isUpgradeAllowedByWave() {
    return (this.getMeta().AllowByWave || 1) + this.upgradeLevel;
  }

  private upgrade() {
    if (!this.isUpgradeAllowed()) {
      return;
    }

    const waveNumber = this.isUpgradeAllowedByWave();

    if (waveNumber > this.scene.wave.number) {
      this.scene.game.screen.notice(NoticeType.ERROR, `UPGRADE WILL BE AVAILABLE ON ${waveNumber} WAVE`);

      return;
    }

    const cost = this.getUpgradeCost();

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

    const experience = progressionLinear(
      DIFFICULTY.BUILDING_UPGRADE_EXPERIENCE,
      DIFFICULTY.BUILDING_UPGRADE_EXPERIENCE_GROWTH,
      this.upgradeLevel,
    );

    this.scene.player.giveExperience(experience);

    this.scene.game.screen.notice(NoticeType.INFO, 'BUILDING UPGRADED');
    this.scene.game.sound.play(BuildingAudio.UPGRADE);
    this.scene.game.tutorial.complete(TutorialStep.UPGRADE_BUILDING);
  }

  private setInteractiveByShape() {
    const shape = new Hexagon(0, 0, LEVEL_TILE_SIZE.height * 0.5);

    return this.setInteractive({
      hitArea: shape,
      hitAreaCallback: Hexagon.Contains,
      useHandCursor: true,
    });
  }

  private onDamage() {
    const audio = Phaser.Utils.Array.GetRandom([
      BuildingAudio.DAMAGE_1,
      BuildingAudio.DAMAGE_2,
    ]);

    if (this.scene.game.sound.getAll(audio).length < 3) {
      this.scene.game.sound.play(audio);
    }

    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.DAMAGE,
        position: this,
        rate: 14,
      });
    }
  }

  private onDead() {
    this.scene.game.screen.notice(NoticeType.WARN, `${this.getMeta().Name} HAS BEEN DESTROYED`);

    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.SMOKE,
        audio: BuildingAudio.DEAD,
        position: {
          x: this.x,
          y: this.y + LEVEL_TILE_SIZE.height * 0.5,
        },
        rate: 18,
      });
    }

    this.destroy();
  }

  private focus() {
    this.toFocus = true;

    if (
      this.isFocused
      || this.scene.player.live.isDead()
      || this.scene.builder.isBuild
    ) {
      return;
    }

    this.isFocused = true;
  }

  private unfocus() {
    this.toFocus = false;

    if (!this.isFocused) {
      return;
    }

    this.isFocused = false;
  }

  public select() {
    if (!this.isFocused || this.isSelected) {
      return;
    }

    // Need to fix events order
    if (this.scene.selectedBuilding) {
      this.scene.selectedBuilding.unselect();
    }

    this.scene.selectedBuilding = this;
    this.isSelected = true;

    if (this.actionsArea) {
      this.actionsArea.setVisible(true);
    }

    this.scene.events.emit(WorldEvents.SELECT_BUILDING, this);
  }

  public unselect() {
    if (!this.isSelected) {
      return;
    }

    this.scene.selectedBuilding = null;
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
      }[state];

      if (this.outlineState === BuildingOutlineState.NONE) {
        this.addShader('OutlineShader', {
          size: 3.0,
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

  private updateAlert() {
    if (this.hasAlert) {
      if (!this.alertTween) {
        const targetColor = [255, 140, 140];

        this.alertTween = <Phaser.Tweens.Tween> this.scene.tweens.add({
          targets: this,
          tintForce: { from: 0.0, to: 1.0 },
          duration: 600,
          ease: 'Linear',
          yoyo: true,
          repeat: -1,
          onUpdate: (_, __, ___, force: number) => {
            const [r, g, b] = targetColor.map((c) => c + (255 - c) * force);
            const color = Phaser.Display.Color.GetColor(r, g, b);

            this.setTint(color);
          },
        });
      }
    } else if (this.alertTween) {
      this.clearTint();
      this.alertTween.destroy();
      this.alertTween = null;
    }
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
    if (!this.actions?.radius || this.actionsArea) {
      return;
    }

    this.actionsArea = this.scene.add.ellipse(this.x, this.y + LEVEL_TILE_SIZE.height * 0.5);
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

    const d = this.getActionsRadius() * 2;
    const positionY = this.y + LEVEL_TILE_SIZE.height * 0.5;

    this.actionsArea.setSize(d, d * LEVEL_TILE_SIZE.persperctive);
    this.actionsArea.setDepth(Level.GetDepth(positionY, 0, d * LEVEL_TILE_SIZE.persperctive));
    this.actionsArea.updateDisplayOrigin();
  }

  private break() {
    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.SMOKE,
        audio: BuildingAudio.DEAD,
        position: {
          x: this.x,
          y: this.y + LEVEL_TILE_SIZE.height * 0.5,
        },
        rate: 18,
      });
    }

    this.destroy();
  }
}

registerAudioAssets(BuildingAudio);
registerSpriteAssets(BuildingTexture, {
  width: LEVEL_TILE_SIZE.width,
  height: LEVEL_TILE_SIZE.height,
});

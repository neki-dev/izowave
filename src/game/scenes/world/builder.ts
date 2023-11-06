import Phaser from 'phaser';

import { WORLD_DEPTH_GRAPHIC } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDING_TILE } from '~const/world/entities/building';
import { BUILDINGS } from '~const/world/entities/buildings';
import { LEVEL_MAP_PERSPECTIVE, LEVEL_MAP_TILE } from '~const/world/level';
import { Analytics } from '~lib/analytics';
import { isPositionsEqual } from '~lib/dimension';
import { phrase } from '~lib/lang';
import { progressionLinear } from '~lib/progression';
import { Tutorial } from '~lib/tutorial';
import { getStage } from '~lib/utils';
import { Level } from '~scene/world/level';
import { ShaderType } from '~type/shader';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { BuilderEvents, IBuilder } from '~type/world/builder';
import { EntityType } from '~type/world/entities';
import {
  BuildingAudio, BuildingBuildData, BuildingIcon, BuildingVariant, IBuilding,
} from '~type/world/entities/building';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { PlayerSkill } from '~type/world/entities/player';
import {
  BiomeType, TileType, PositionAtWorld, PositionAtMatrix,
} from '~type/world/level';

export class Builder extends Phaser.Events.EventEmitter implements IBuilder {
  readonly scene: IWorld;

  private _isBuild: boolean = false;

  public get isBuild() { return this._isBuild; }

  private set isBuild(v) { this._isBuild = v; }

  public selectedBuilding: Nullable<IBuilding> = null;

  private buildPreview: Nullable<Phaser.GameObjects.Image> = null;

  private buildActionRadius: Nullable<Phaser.GameObjects.Ellipse> = null;

  private buildControls: Nullable<Phaser.GameObjects.Container> = null;

  private buildings: Partial<Record<BuildingVariant, IBuilding[]>> = {};

  private _supposedPosition: Nullable<PositionAtMatrix> = null;

  public get supposedPosition() { return this._supposedPosition; }

  private set supposedPosition(v) { this._supposedPosition = v; }

  private _variant: Nullable<BuildingVariant> = null;

  public get variant() { return this._variant; }

  private set variant(v) { this._variant = v; }

  constructor(scene: IWorld) {
    super();

    this.scene = scene;

    this.handleKeyboard();
    this.handlePointer();
    this.handleTutorial();

    Tutorial.Start(TutorialStep.BUILD_TOWER_FIRE);
  }

  public destroy() {
    this.close();
    this.removeAllListeners();
  }

  public update() {
    try {
      if (this.isCanBuild()) {
        if (this.isBuild) {
          this.updateSupposedPosition();
          this.updateBuildInstance();
        } else {
          this.open();
        }
      } else if (this.isBuild) {
        this.close();
      }
    } catch (error) {
      Analytics.TrackWarn('Failed to update builder', error as TypeError);
    }
  }

  public setBuildingVariant(variant: BuildingVariant) {
    if (
      this.variant === variant
      || !this.isBuildingAllowByTutorial(variant)
    ) {
      return;
    }

    const BuildingInstance = BUILDINGS[variant];

    if (!this.isBuildingAllowByWave(variant)) {
      this.scene.game.screen.failure('BUILDING_WILL_BE_AVAILABLE', [BuildingInstance.AllowByWave]);

      return;
    }

    if (this.isBuildingLimitReached(variant)) {
      this.scene.game.screen.failure('BUILDING_LIMIT_REACHED', [phrase(`BUILDING_NAME_${variant}`)]);

      return;
    }

    if (this.scene.player.resources < BuildingInstance.Cost) {
      this.scene.game.screen.failure('NOT_ENOUGH_RESOURCES');

      return;
    }

    if (this.isBuild) {
      this.destroyBuildInstance();
      this.variant = variant;
      this.createBuildInstance();
    } else {
      this.variant = variant;
    }

    this.scene.sound.play(BuildingAudio.SELECT);
  }

  public unsetBuildingVariant() {
    if (this.variant === null) {
      return;
    }

    this.scene.sound.play(BuildingAudio.UNSELECT);

    this.clearBuildingVariant();

    if (Tutorial.IsInProgress(TutorialStep.STOP_BUILD)) {
      Tutorial.Complete(TutorialStep.STOP_BUILD);
      Tutorial.Start(TutorialStep.UPGRADE_SKILL);
    }
  }

  private addFoundation(position: PositionAtMatrix) {
    const newBiome = this.scene.level.getBiome(BiomeType.RUBBLE);

    if (!newBiome) {
      return;
    }

    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        const biome = this.scene.level.map.getAt({ x, y });

        if (biome && biome.solid && biome.type !== BiomeType.RUBBLE) {
          // Replace biome
          const index = Array.isArray(newBiome.tileIndex)
            ? Phaser.Math.Between(...newBiome.tileIndex)
            : newBiome.tileIndex;

          this.scene.level.groundLayer.putTileAt(index, x, y);
          this.scene.level.map.replaceAt({ x, y }, newBiome);

          // Remove scenery
          const tile = this.scene.level.getTileWithType({ x, y, z: 1 }, TileType.SCENERY);

          if (tile) {
            tile.destroy();
          }

          // Remove effects
          this.scene.level.effectsOnGround.forEach((effect) => {
            const positionAtMatrix = Level.ToMatrixPosition(effect);

            if (isPositionsEqual(positionAtMatrix, { x, y })) {
              effect.destroy();
            }
          });
        }
      }
    }
  }

  public isBuildingAllowByWave(variant: BuildingVariant, number?: number) {
    const waveAllowed = BUILDINGS[variant].AllowByWave;

    if (waveAllowed) {
      return (waveAllowed <= (number ?? this.scene.wave.number));
    }

    return true;
  }

  public getBuildingLimit(variant: BuildingVariant): Nullable<number> {
    if (!BUILDINGS[variant].Limit) {
      return null;
    }

    const start = BUILDINGS[variant].AllowByWave ?? 1;
    const limit = getStage(start, this.scene.wave.number);

    return Math.min(limit, DIFFICULTY.BUILDING_LIMITED_BOUND);
  }

  public getBuildingsByVariant<T extends IBuilding>(variant: BuildingVariant) {
    return (this.buildings[variant] ?? []) as T[];
  }

  private open() {
    if (this.isBuild) {
      return;
    }

    this.isBuild = true;

    if (!this.scene.game.isDesktop()) {
      this.supposedPosition = (
        this.scene.level.getFreeAdjacentTiles(this.scene.player.positionAtMatrix)[0]
        ?? this.scene.player.positionAtMatrix
      );
    }

    this.createBuildInstance();

    this.emit(BuilderEvents.BUILD_START);
  }

  public close() {
    if (!this.isBuild) {
      return;
    }

    this.destroyBuildInstance();

    this.isBuild = false;
    this.supposedPosition = null;

    this.emit(BuilderEvents.BUILD_STOP);
  }

  private clearBuildingVariant() {
    this.close();
    this.variant = null;
  }

  private switchBuildingVariant(index: number) {
    const variant = Object.keys(BUILDINGS)[index] as BuildingVariant;

    if (variant) {
      if (this.variant === variant) {
        this.unsetBuildingVariant();
      } else {
        this.setBuildingVariant(variant);
      }
    }
  }

  private isCanBuild() {
    return (
      this.variant !== null
      && !this.scene.player.live.isDead()
    );
  }

  private isAllowBuild() {
    if (!this.supposedPosition) {
      return false;
    }

    const positionAtMatrix = this.supposedPosition;
    const biome = this.scene.level.map.getAt(positionAtMatrix);

    if (!biome?.solid) {
      return false;
    }

    const isFreeFromTile = this.scene.level.isFreePoint({ ...positionAtMatrix, z: 1 });

    if (!isFreeFromTile) {
      return false;
    }

    const targets = [
      this.scene.player,
      ...this.scene.getEntities<IEnemy>(EntityType.ENEMY),
    ];

    const isFreeFromSprite = targets.every((npc) => (
      npc.getAllPositionsAtMatrix().every((point) => !isPositionsEqual(positionAtMatrix, point))
    ));

    if (!isFreeFromSprite) {
      return false;
    }

    return true;
  }

  private build() {
    if (
      !this.variant
      || !this.supposedPosition
      || !this.isAllowBuild()
    ) {
      return;
    }

    const BuildingInstance = BUILDINGS[this.variant];

    if (this.isBuildingLimitReached(this.variant)) {
      this.scene.game.screen.failure('BUILDING_LIMIT_REACHED', [phrase(`BUILDING_NAME_${this.variant}`)]);

      return;
    }

    if (this.scene.player.resources < BuildingInstance.Cost) {
      this.scene.game.screen.failure('NOT_ENOUGH_RESOURCES');

      return;
    }

    this.createBuilding({
      variant: this.variant,
      positionAtMatrix: this.supposedPosition,
      buildDuration: progressionLinear({
        defaultValue: DIFFICULTY.BUILDER_BUILD_DURATION,
        scale: DIFFICULTY.BUILDER_BUILD_DURATION_GROWTH,
        level: this.scene.player.upgradeLevel[PlayerSkill.BUILD_SPEED],
      }),
    });

    this.scene.player.takeResources(BuildingInstance.Cost);
    this.scene.player.giveExperience(DIFFICULTY.BUILDING_BUILD_EXPERIENCE);

    this.scene.sound.play(BuildingAudio.BUILD);

    if (this.variant) {
      if (this.scene.game.isDesktop()) {
        if (this.isBuildingLimitReached(this.variant)) {
          this.clearBuildingVariant();
        } else {
          Tutorial.Start(TutorialStep.STOP_BUILD);
        }
      } else {
        this.clearBuildingVariant();
      }
    }
  }

  public createBuilding(data: BuildingBuildData) {
    const BuildingInstance = BUILDINGS[data.variant];
    const building = new BuildingInstance(this.scene, {
      buildDuration: data.buildDuration,
      positionAtMatrix: data.positionAtMatrix,
    });

    this.addFoundation(data.positionAtMatrix);

    let list = this.buildings[data.variant];

    if (list) {
      list.push(building);
    } else {
      list = [building];
      this.buildings[data.variant] = list;
    }

    building.once(Phaser.GameObjects.Events.DESTROY, () => {
      if (list) {
        const index = list.indexOf(building);

        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    });

    return building;
  }

  public isBuildingLimitReached(variant: BuildingVariant) {
    const limit = this.getBuildingLimit(variant);

    if (limit) {
      return this.getBuildingsByVariant(variant).length >= limit;
    }

    return false;
  }

  private createBuildPreview() {
    if (!this.variant) {
      return;
    }

    const BuildingInstance = BUILDINGS[this.variant];

    this.buildPreview = this.scene.add.image(0, 0, BuildingInstance.Texture);
    this.buildPreview.setOrigin(0.5, BUILDING_TILE.origin);
    this.buildPreview.addShader(ShaderType.OUTLINE, {
      size: 3.0,
      color: 0xffffff,
    });
  }

  private createBuildActionRadius() {
    if (!this.variant) {
      return;
    }

    const BuildingInstance = BUILDINGS[this.variant];

    if (!BuildingInstance.Radius) {
      return;
    }

    const d = BuildingInstance.Radius * 2;

    this.buildActionRadius = this.scene.add.ellipse(0, 0, d, d * LEVEL_MAP_PERSPECTIVE);
    this.buildActionRadius.setFillStyle(0xffffff, 0.2);
  }

  private createBuildControls() {
    this.buildControls = this.scene.add.container();
    this.buildControls.setDepth(WORLD_DEPTH_GRAPHIC);

    const confirm = this.scene.add.image(-2, 0, BuildingIcon.CONFIRM);

    confirm.setInteractive();
    confirm.setOrigin(1.0, 0.5);

    confirm.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      pointer.reset();
      this.build();
    });

    const decline = this.scene.add.image(2, 0, BuildingIcon.DECLINE);

    decline.setInteractive();
    decline.setOrigin(0.0, 0.5);

    decline.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.unsetBuildingVariant();
    });

    this.buildControls.add([confirm, decline]);
  }

  private createBuildInstance() {
    this.createBuildPreview();
    this.createBuildActionRadius();

    if (!this.scene.game.isDesktop()) {
      this.createBuildControls();
    }

    this.updateBuildInstance();
  }

  private updateBuildInstance() {
    if (!this.supposedPosition) {
      return;
    }

    const positionAtWorld = Level.ToWorldPosition(this.supposedPosition);
    const depth = positionAtWorld.y + 1;
    const isAllow = this.isAllowBuild();

    if (this.buildPreview) {
      this.buildPreview.setPosition(positionAtWorld.x, positionAtWorld.y);
      this.buildPreview.setDepth(depth);
      this.buildPreview.setAlpha(isAllow ? 1.0 : 0.25);
    }

    if (this.buildActionRadius) {
      this.buildActionRadius.setPosition(positionAtWorld.x, positionAtWorld.y);
      this.buildActionRadius.setVisible(isAllow);
    }

    if (this.buildControls) {
      const confirmButton = this.buildControls.getAt<Phaser.GameObjects.Image>(0);

      this.buildControls.setPosition(positionAtWorld.x, positionAtWorld.y + BUILDING_TILE.height);
      confirmButton.setTexture(isAllow ? BuildingIcon.CONFIRM : BuildingIcon.CONFIRM_DISABLED);
    }
  }

  private destroyBuildInstance() {
    if (this.buildPreview) {
      this.buildPreview.destroy();
      this.buildPreview = null;
    }

    if (this.buildActionRadius) {
      this.buildActionRadius.destroy();
      this.buildActionRadius = null;
    }

    if (this.buildControls) {
      this.buildControls.destroy();
      this.buildControls = null;
    }
  }

  private getCurrentPointer() {
    const busyPointerId = this.scene.game.screen.joystickActivePointer?.id;

    return busyPointerId === 1
      ? this.scene.input.pointer2
      : this.scene.input.pointer1;
  }

  private updateSupposedPosition() {
    let position: PositionAtWorld;

    if (this.scene.game.isDesktop()) {
      position = {
        x: this.scene.input.activePointer.worldX,
        y: this.scene.input.activePointer.worldY,
      };
    } else {
      if (this.scene.camera.isZooming()) {
        return;
      }

      const pointer = this.getCurrentPointer();

      if (!pointer.active || pointer.event.target !== this.scene.game.canvas) {
        return;
      }

      pointer.updateWorldPoint(this.scene.cameras.main);

      position = {
        x: pointer.worldX,
        y: pointer.worldY - LEVEL_MAP_TILE.height / this.scene.cameras.main.zoom,
      };
    }

    this.supposedPosition = Level.ToMatrixPosition(position);
  }

  public isBuildingAllowByTutorial(variant: BuildingVariant) {
    if (!Tutorial.IsEnabled) {
      return true;
    }

    const restrictions: {
      step: TutorialStep
      variant: BuildingVariant
    }[] = [
      { step: TutorialStep.BUILD_TOWER_FIRE, variant: BuildingVariant.TOWER_FIRE },
      { step: TutorialStep.BUILD_GENERATOR, variant: BuildingVariant.GENERATOR },
      { step: TutorialStep.BUILD_GENERATOR_SECOND, variant: BuildingVariant.GENERATOR },
      { step: TutorialStep.BUILD_AMMUNITION, variant: BuildingVariant.AMMUNITION },
      { step: TutorialStep.BUILD_RADAR, variant: BuildingVariant.RADAR },
    ];

    const restriction = restrictions.find((item) => Tutorial.IsInProgress(item.step));

    return restriction
      ? (restriction.variant === variant)
      : (this.scene.wave.number > 2);
  }

  private handleKeyboard() {
    if (!this.scene.game.isDesktop()) {
      return;
    }

    this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, (event: KeyboardEvent) => {
      if (Number(event.key)) {
        this.switchBuildingVariant(Number(event.key) - 1);
      }
    });
  }

  private handlePointer() {
    if (!this.scene.game.isDesktop()) {
      return;
    }

    this.scene.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
      if (!this.isBuild) {
        return;
      }

      if (pointer.button === 0) {
        this.build();
      } else if (pointer.button === 2) {
        this.unsetBuildingVariant();
      }
    });
  }

  private handleTutorial() {
    let hintId: Nullable<string> = null;

    Tutorial.Bind(TutorialStep.STOP_BUILD, {
      beg: () => {
        hintId = this.scene.showHint({
          side: 'top',
          label: 'TUTORIAL_STOP_BUILD',
          position: () => (
            this.supposedPosition
              ? Level.ToWorldPosition({
                x: this.supposedPosition.x + 1,
                y: this.supposedPosition.y + 1,
              })
              : { x: 0, y: 0 }
          ),
        });
      },
      end: () => {
        if (hintId) {
          this.scene.hideHint(hintId);
          hintId = null;
        }
      },
    });

    Tutorial.Bind(TutorialStep.BUILD_TOWER_FIRE, {
      beg: () => {
        this.scene.setTimePause(true);
      },
      end: () => {
        this.scene.setTimePause(false);
        this.clearBuildingVariant();
      },
    });

    Tutorial.Bind(TutorialStep.BUILD_GENERATOR, {
      beg: () => {
        this.scene.setTimePause(true);
      },
      end: () => {
        this.scene.setTimePause(false);
      },
    });
  }
}

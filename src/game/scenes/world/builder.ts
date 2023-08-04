import EventEmitter from 'events';

import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDINGS } from '~const/world/entities/buildings';
import { LEVEL_TILE_SIZE } from '~const/world/level';
import { getStage, equalPositions } from '~lib/utils';
import { Level } from '~scene/world/level';
import { NoticeType } from '~type/screen';
import { TutorialStep, TutorialStepState } from '~type/tutorial';
import { IWorld } from '~type/world';
import { BuilderEvents, IBuilder } from '~type/world/builder';
import { EntityType } from '~type/world/entities';
import { BuildingAudio, BuildingVariant, IBuilding } from '~type/world/entities/building';
import { LiveEvents } from '~type/world/entities/live';
import { INPC } from '~type/world/entities/npc';
import { BiomeType, TileType, Vector2D } from '~type/world/level';

export class Builder extends EventEmitter implements IBuilder {
  readonly scene: IWorld;

  private _isBuild: boolean = false;

  public get isBuild() { return this._isBuild; }

  private set isBuild(v) { this._isBuild = v; }

  public selectedBuilding: Nullable<IBuilding> = null;

  private buildArea: Nullable<Phaser.GameObjects.Ellipse> = null;

  private buildingPreview: Nullable<Phaser.GameObjects.Image> = null;

  private buildings: Partial<Record<BuildingVariant, IBuilding[]>> = {};

  private _variant: Nullable<BuildingVariant> = null;

  public get variant() { return this._variant; }

  private set variant(v) { this._variant = v; }

  private _radius: number = DIFFICULTY.BUILDER_BUILD_AREA;

  public get radius() { return this._radius; }

  private set radius(v) { this._radius = v; }

  constructor(scene: IWorld) {
    super();

    this.scene = scene;

    this.setMaxListeners(0);
    this.addKeyboardHandler();
    this.addTutorialHandler();

    this.scene.player.live.on(LiveEvents.DEAD, () => {
      this.closeBuilder();
    });
  }

  public update() {
    if (this.isCanBuild()) {
      if (this.isBuild) {
        this.updateBuildAreaPosition();
        this.updateBuildingPreview();
      } else {
        this.openBuilder();
      }
    } else if (this.isBuild) {
      this.closeBuilder();
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
      this.scene.game.screen.notice(
        NoticeType.ERROR,
        `Will be available on ${BuildingInstance.AllowByWave} wave`,
      );

      return;
    }

    this.scene.sound.play(BuildingAudio.SELECT);

    this.variant = variant;

    if (this.buildingPreview) {
      this.buildingPreview.setTexture(BuildingInstance.Texture);
    }
  }

  public unsetBuildingVariant() {
    if (this.variant === null) {
      return;
    }

    this.scene.sound.play(BuildingAudio.UNSELECT);

    this.scene.game.tutorial.complete(TutorialStep.STOP_BUILD);

    this.clearBuildingVariant();
  }

  public addFoundation(position: Vector2D) {
    const newBiome = Level.GetBiome(BiomeType.RUBBLE);

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

          // Remove trees
          const tile = this.scene.level.getTileWithType({ x, y, z: 1 }, TileType.TREE);

          if (tile) {
            tile.destroy();
          }

          // Remove effects
          this.scene.level.effectsOnGround.forEach((effect) => {
            const positionAtMatrix = Level.ToMatrixPosition(effect);

            if (equalPositions(positionAtMatrix, { x, y })) {
              effect.destroy();
            }
          });
        }
      }
    }
  }

  public isBuildingAllowByTutorial(variant: BuildingVariant) {
    if (!this.scene.game.tutorial.isEnabled) {
      return true;
    }

    const links: {
      step: TutorialStep
      variant: BuildingVariant
    }[] = [
      { step: TutorialStep.BUILD_TOWER_FIRE, variant: BuildingVariant.TOWER_FIRE },
      { step: TutorialStep.BUILD_GENERATOR, variant: BuildingVariant.GENERATOR },
    ];

    const current = links.find((link) => (
      this.scene.game.tutorial.state(link.step) === TutorialStepState.IN_PROGRESS
    ));

    return (!current || current.variant === variant);
  }

  public isBuildingAllowByWave(variant: BuildingVariant) {
    const waveAllowed = BUILDINGS[variant].AllowByWave;

    if (waveAllowed) {
      return (waveAllowed <= this.scene.wave.number);
    }

    return true;
  }

  public getBuildingLimit(variant: BuildingVariant): Nullable<number> {
    if (!BUILDINGS[variant].Limit) {
      return null;
    }

    const start = BUILDINGS[variant].AllowByWave ?? 1;
    const limit = getStage(start, this.scene.wave.number);

    return limit;
  }

  public getBuildingsByVariant<T extends IBuilding>(variant: BuildingVariant) {
    return (this.buildings[variant] ?? []) as T[];
  }

  private getAssumedPosition() {
    return Level.ToMatrixPosition({
      x: this.scene.input.activePointer.worldX,
      y: this.scene.input.activePointer.worldY,
    });
  }

  private onMouseClick(pointer: Phaser.Input.Pointer) {
    if (pointer.button === 0) {
      this.build();
    } else if (pointer.button === 2) {
      this.unsetBuildingVariant();
    }
  }

  private openBuilder() {
    if (this.isBuild) {
      return;
    }

    this.createBuildArea();
    this.createBuildingPreview();

    this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.onMouseClick, this);

    this.isBuild = true;

    this.emit(BuilderEvents.BUILD_START);
  }

  private closeBuilder() {
    if (!this.isBuild) {
      return;
    }

    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onMouseClick);

    this.destroyBuildingPreview();
    this.destroyBuildArea();

    this.isBuild = false;

    this.emit(BuilderEvents.BUILD_STOP);
  }

  private clearBuildingVariant() {
    this.closeBuilder();
    this.variant = null;
  }

  private switchBuildingVariant(index: number) {
    const variant = Object.values(BuildingVariant)[index];

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
    if (!this.buildArea) {
      return false;
    }

    const positionAtMatrix = this.getAssumedPosition();

    const positionAtWorldDown = Level.ToWorldPosition({ ...positionAtMatrix, z: 0 });
    const offset = this.buildArea.getTopLeft() as Vector2D;
    const inArea = this.buildArea.geom.contains(
      positionAtWorldDown.x - offset.x,
      positionAtWorldDown.y - offset.y,
    );

    if (!inArea) {
      return false;
    }

    const biome = this.scene.level.map.getAt(positionAtMatrix);

    if (!biome?.solid) {
      return false;
    }

    const isFreeFromTile = this.scene.level.isFreePoint({ ...positionAtMatrix, z: 1 });

    if (!isFreeFromTile) {
      return false;
    }

    let spritePositionsAtMatrix = this.scene.player.getAllPositionsAtMatrix();

    this.scene.getEntities<INPC>(EntityType.NPC).forEach((npc) => {
      spritePositionsAtMatrix = spritePositionsAtMatrix.concat(npc.getAllPositionsAtMatrix());
    });

    const isFreeFromSprite = spritePositionsAtMatrix.every((point) => !equalPositions(positionAtMatrix, point));

    if (!isFreeFromSprite) {
      return false;
    }

    return true;
  }

  private build() {
    if (!this.variant || !this.isAllowBuild()) {
      return;
    }

    const BuildingInstance = BUILDINGS[this.variant];

    if (this.isBuildingLimitReached(this.variant)) {
      this.scene.game.screen.notice(NoticeType.ERROR, `You have maximum ${BuildingInstance.Name}`);

      return;
    }

    if (this.scene.player.resources < BuildingInstance.Cost) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'Not enough resources');

      return;
    }

    let list = this.buildings[this.variant];
    const building = new BuildingInstance(this.scene, {
      positionAtMatrix: this.getAssumedPosition(),
    });

    if (list) {
      list.push(building);
    } else {
      list = [building];
      this.buildings[this.variant] = list;
    }

    building.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (list) {
        const index = list.indexOf(building);

        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    });

    this.scene.player.takeResources(BuildingInstance.Cost);
    this.scene.player.giveExperience(DIFFICULTY.BUILDING_BUILD_EXPERIENCE);

    this.scene.sound.play(BuildingAudio.BUILD);

    this.emit(BuilderEvents.BUILD, building);
  }

  private isBuildingLimitReached(variant: BuildingVariant) {
    const limit = this.getBuildingLimit(variant);

    if (limit) {
      return (this.getBuildingsByVariant(variant).length >= limit);
    }

    return false;
  }

  private createBuildArea() {
    this.buildArea = this.scene.add.ellipse();
    this.buildArea.setStrokeStyle(2, 0xffffff, 0.4);

    this.updateBuildAreaPosition();
    this.updateBuildAreaSize();
  }

  public setBuildAreaRadius(radius: number) {
    this.radius = radius;

    if (this.buildArea) {
      this.updateBuildAreaSize();
    }
  }

  private updateBuildAreaSize() {
    if (!this.buildArea) {
      return;
    }

    this.buildArea.setSize(
      this.radius * 2,
      this.radius * 2 * LEVEL_TILE_SIZE.persperctive,
    );
    this.buildArea.updateDisplayOrigin();
    this.buildArea.setDepth(WORLD_DEPTH_EFFECT);
  }

  private updateBuildAreaPosition() {
    if (!this.buildArea) {
      return;
    }

    const position = this.scene.player.getPositionOnGround();

    this.buildArea.setPosition(position.x, position.y);
  }

  private destroyBuildArea() {
    if (!this.buildArea) {
      return;
    }

    this.buildArea.destroy();
    this.buildArea = null;
  }

  private createBuildingPreview() {
    if (!this.variant) {
      return;
    }

    const BuildingInstance = BUILDINGS[this.variant];

    this.buildingPreview = this.scene.add.image(0, 0, BuildingInstance.Texture);
    this.buildingPreview.setOrigin(0.5, LEVEL_TILE_SIZE.origin);

    this.updateBuildingPreview();
  }

  private updateBuildingPreview() {
    if (!this.buildingPreview) {
      return;
    }

    const positionAtMatrix = this.getAssumedPosition();
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);
    const depth = Level.GetTileDepth(positionAtWorld.y, tilePosition.z) + 1;

    this.buildingPreview.setPosition(positionAtWorld.x, positionAtWorld.y);
    this.buildingPreview.setDepth(depth);
    this.buildingPreview.setAlpha(this.isAllowBuild() ? 1.0 : 0.25);
  }

  private destroyBuildingPreview() {
    if (!this.buildingPreview) {
      return;
    }

    this.buildingPreview.destroy();
    this.buildingPreview = null;
  }

  private addKeyboardHandler() {
    this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, (event: KeyboardEvent) => {
      if (Number(event.key)) {
        this.switchBuildingVariant(Number(event.key) - 1);
      }
    });
  }

  private addTutorialHandler() {
    this.scene.game.tutorial.bind(TutorialStep.BUILD_TOWER_FIRE, {
      beg: () => {
        this.scene.setTimePause(true);
      },
      end: () => {
        this.scene.setTimePause(false);
        this.clearBuildingVariant();
      },
    });

    this.scene.game.tutorial.bind(TutorialStep.BUILD_GENERATOR, {
      beg: () => {
        this.scene.setTimePause(true);
      },
      end: () => {
        this.scene.setTimePause(false);
      },
    });

    this.scene.game.screen.events.on(Phaser.Interface.Events.MOUNT, () => {
      this.scene.game.tutorial.start(TutorialStep.BUILD_TOWER_FIRE);
    });
  }
}

import EventEmitter from 'events';

import Phaser from 'phaser';

import { BUILDINGS } from '~const/buildings';
import { DIFFICULTY } from '~const/difficulty';
import { TILE_META } from '~const/level';
import { calcGrowth, equalPositions } from '~lib/utils';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { NoticeType } from '~type/screen/notice';
import { TutorialStep } from '~type/tutorial';
import { BuilderEvents } from '~type/world/builder';
import { BuildingAudio, BuildingMeta, BuildingVariant } from '~type/world/entities/building';
import { BiomeType, TileType } from '~type/world/level';
import { WaveEvents } from '~type/world/wave';

const BUILDING_VARIANTS = Object.values(BuildingVariant);

export class Builder extends EventEmitter {
  readonly scene: World;

  /**
   * Build state.
   */
  private _isBuild: boolean = false;

  public get isBuild() { return this._isBuild; }

  private set isBuild(v) { this._isBuild = v; }

  /**
   * Permitted build area.
   */
  private buildArea: Nullable<Phaser.GameObjects.Ellipse> = null;

  /**
   * Building preview.
   */
  private buildingPreview: Nullable<Phaser.GameObjects.Image> = null;

  /**
   * Current building variant index.
   */
  private _variantIndex: Nullable<number> = null;

  public get variantIndex() { return this._variantIndex; }

  private set variantIndex(v) { this._variantIndex = v; }

  /**
   * Builder constructor.
   */
  constructor(scene: World) {
    super();

    this.scene = scene;

    this.scene.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, this.switchBuildingVariant, this);

    this.scene.wave.on(WaveEvents.START, () => {
      this.variantIndex = null;
    });
  }

  /**
   * Toggle build state and update build area.
   */
  public update() {
    if (this.isCanBuild()) {
      if (this.isBuild) {
        this.updateBuildArea();
      } else {
        this.openBuilder();
      }
    } else if (this.isBuild) {
      this.closeBuilder();
    }
  }

  /**
   * Set current building variant.
   */
  public setBuildingVariant(index: number) {
    if (this.scene.wave.isGoing || this.variantIndex === index) {
      return;
    }

    const variant = BUILDING_VARIANTS[index];
    const data: BuildingMeta = BUILDINGS[variant];

    if (!this.isBuildingAllowedByTutorial(variant)) {
      return;
    }

    if (!this.isBuildingAllowedByWave(variant)) {
      this.scene.screen.message(NoticeType.ERROR, `${data.Name} BE AVAILABLE ON ${data.WaveAllowed} WAVE`);

      return;
    }

    if (this.isBuildingLimitReached(variant)) {
      this.scene.screen.message(NoticeType.ERROR, `YOU HAVE MAXIMUM ${data.Name}`);

      return;
    }

    this.scene.sound.play(BuildingAudio.SELECT);

    this.variantIndex = index;

    if (this.buildingPreview) {
      this.buildingPreview.setTexture(this.getBuildingMeta('Texture'));
    }
  }

  /**
   * Unset current building variant.
   */
  public unsetBuildingVariant() {
    if (this.scene.wave.isGoing || this.variantIndex === null) {
      return;
    }

    this.scene.sound.play(BuildingAudio.UNSELECT);

    this.clearBuildingVariant();
  }

  /**
   * Clear current building variant.
   */
  public clearBuildingVariant() {
    this.variantIndex = null;
  }

  /**
   * Check is building variant selected.
   */
  public isVariantSelected() {
    return (this.variantIndex !== null);
  }

  /**
   * Get build limit on current wave.
   *
   * @param limit - Default limit
   */
  public getBuildCurrentLimit(limit: number): number {
    return limit * (Math.floor(this.scene.wave.number / 5) + 1);
  }

  /**
   * Add rubble foundation on position.
   *
   * @param position - Position at matrix
   */
  public addFoundation(position: Phaser.Types.Math.Vector2Like) {
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        const tileGround = this.scene.level.getTile({ x, y, z: 0 });

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
          const tilePosition = { x, y, z: 1 };
          const tile = this.scene.level.getTileWithType(tilePosition, TileType.TREE);

          if (tile) {
            this.scene.level.removeTile(tilePosition);
            tile.destroy();
          }
        }
      }
    }
  }

  /**
   * Get current pointer world position
   * and converting to build grided position.
   */
  private getAssumedPosition(): Phaser.Types.Math.Vector2Like {
    return Level.ToMatrixPosition({
      x: this.scene.input.activePointer.worldX,
      y: this.scene.input.activePointer.worldY,
    });
  }

  /**
   * Get building meta parameter.
   *
   * @param param - Parameter key
   */
  private getBuildingMeta(param: string) {
    const variant = BUILDING_VARIANTS[this.variantIndex];

    return BUILDINGS[variant][param];
  }

  /**
   * Create builder interface and allow build.
   */
  private openBuilder() {
    if (this.isBuild) {
      return;
    }

    this.createBuildArea();
    this.createBuildingPreview();

    this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.build, this);
    this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.updateBuildingPreview, this);

    this.isBuild = true;

    this.emit(BuilderEvents.BUILD_START);
  }

  /**
   * Remove builder interface and disallow build.
   */
  private closeBuilder() {
    if (!this.isBuild) {
      return;
    }

    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.build);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.updateBuildingPreview);

    this.destroyBuildingPreview();
    this.destroyBuildArea();

    this.isBuild = false;

    this.emit(BuilderEvents.BUILD_STOP);
  }

  /**
   * Switch current building variant.
   */
  private switchBuildingVariant(e: KeyboardEvent) {
    if (e.key === 'Backspace') {
      if (this.variantIndex !== null) {
        this.unsetBuildingVariant();
      }
    } else if (Number(e.key)) {
      const index = Number(e.key) - 1;

      if (!BUILDING_VARIANTS[index]) {
        return;
      }

      if (this.variantIndex === index) {
        this.unsetBuildingVariant();
      } else {
        this.setBuildingVariant(index);
      }
    }
  }

  /**
   * Checks if player is stopped and wave not going.
   */
  private isCanBuild(): boolean {
    return (
      this.isVariantSelected()
      && !this.scene.wave.isGoing
      && !this.scene.player.live.isDead()
      && this.scene.player.isStopped()
    );
  }

  /**
   * Checks if allow to build on estimated position.
   */
  private isAllowBuild(): boolean {
    const positionAtMatrix = this.getAssumedPosition();
    const tilePosition = { ...positionAtMatrix, z: 1 };

    // Pointer in build area
    const positionAtWorldDown = Level.ToWorldPosition({ ...positionAtMatrix, z: 0 });
    const offset = this.buildArea.getTopLeft();
    const inArea = this.buildArea.geom.contains(positionAtWorldDown.x - offset.x, positionAtWorldDown.y - offset.y);

    if (!inArea) {
      return false;
    }

    // Pointer biome is solid
    const tileGround = this.scene.level.getTile({ ...positionAtMatrix, z: 0 });
    const isSolid = tileGround?.biome.solid;

    if (!isSolid) {
      return false;
    }

    // Pointer is not contains player or other buildings
    const playerPositionsAtMatrix = this.scene.player.getAllPositionsAtMatrix();
    const isFree = (
      this.scene.level.isFreePoint(tilePosition)
      && !playerPositionsAtMatrix.some((point) => equalPositions(positionAtMatrix, point))
    );

    if (!isFree) {
      return false;
    }

    return true;
  }

  /**
   * Build in assumed position.
   */
  private build() {
    if (!this.buildingPreview.visible) {
      return;
    }

    if (!this.isAllowBuild()) {
      this.scene.sound.play(BuildingAudio.FAILURE);

      return;
    }

    const variant = BUILDING_VARIANTS[this.variantIndex];
    const BuildingInstance = BUILDINGS[variant];

    if (this.scene.player.resources < BuildingInstance.Cost) {
      this.scene.screen.message(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

      return;
    }

    const positionAtMatrix = this.getAssumedPosition();

    new BuildingInstance(this.scene, positionAtMatrix);

    this.updateBuildArea();

    this.scene.player.takeResources(BuildingInstance.Cost);

    if (this.isBuildingLimitReached(variant)) {
      this.clearBuildingVariant();
    }

    this.scene.sound.play(BuildingAudio.BUILD);

    // Tutorial progress
    switch (this.scene.tutorial.step) {
      case TutorialStep.BUILD_TOWER_FIRE: {
        this.scene.tutorial.progress(TutorialStep.BUILD_GENERATOR);

        this.clearBuildingVariant();
        break;
      }
      case TutorialStep.BUILD_GENERATOR: {
        this.scene.tutorial.progress(TutorialStep.WAVE_TIMELEFT);

        this.clearBuildingVariant();
        this.scene.unpauseProcess();
        break;
      }
      default: break;
    }
  }

  /**
   *
   */
  public isBuildingAllowedByTutorial(variant: BuildingVariant): boolean {
    switch (this.scene.tutorial.step) {
      case TutorialStep.BUILD_TOWER_FIRE: {
        return (variant === BuildingVariant.TOWER_FIRE);
      }
      case TutorialStep.BUILD_GENERATOR: {
        return (variant === BuildingVariant.GENERATOR);
      }
      default: {
        return true;
      }
    }
  }

  /**
   *
   */
  public isBuildingAllowedByWave(variant: BuildingVariant): boolean {
    const waveAllowed = BUILDINGS[variant].WaveAllowed;

    if (waveAllowed) {
      return (waveAllowed <= this.scene.wave.getCurrentNumber());
    }

    return true;
  }

  /**
   *
   */
  private isBuildingLimitReached(variant: BuildingVariant): boolean {
    const limit = BUILDINGS[variant].Limit;

    if (limit) {
      const count = this.scene.selectBuildings(variant).length;
      const currentLimit = this.getBuildCurrentLimit(limit);

      return (count >= currentLimit);
    }

    return false;
  }

  /**
   * Create permitted build area on map.
   */
  private createBuildArea() {
    const d = calcGrowth(
      DIFFICULTY.BUILDING_BUILD_AREA / this.scene.difficulty,
      DIFFICULTY.BUILDING_BUILD_AREA_GROWTH,
      this.scene.player.level,
    ) * 2;

    this.buildArea = this.scene.add.ellipse(0, 0, d, d * TILE_META.persperctive);
    this.buildArea.setStrokeStyle(2, 0xffffff, 0.4);
    this.updateBuildArea();
  }

  /**
   * Update build area position.
   */
  private updateBuildArea() {
    const position = this.scene.player.getBottomCenter();
    const out = TILE_META.height * 2;
    const depth = Level.GetDepth(position.y, 1, this.buildArea.height + out);

    this.buildArea.setPosition(position.x, position.y);
    this.buildArea.setDepth(depth);
  }

  /**
   * Destroy build area.
   */
  private destroyBuildArea() {
    this.buildArea.destroy();
    this.buildArea = null;
  }

  /**
   * Create building variant preview on map.
   */
  private createBuildingPreview() {
    this.buildingPreview = this.scene.add.image(0, 0, this.getBuildingMeta('Texture'));
    this.buildingPreview.setOrigin(0.5, TILE_META.origin);
    this.updateBuildingPreview();
  }

  /**
   * Update position and visible of building preview.
   */
  private updateBuildingPreview() {
    const positionAtMatrix = this.getAssumedPosition();
    const isVisibleTile = this.scene.level.isVisibleTile({ ...positionAtMatrix, z: 0 });

    this.buildingPreview.setVisible(isVisibleTile);

    if (this.buildingPreview.visible) {
      const tilePosition = { ...positionAtMatrix, z: 1 };
      const positionAtWorld = Level.ToWorldPosition(tilePosition);

      this.buildingPreview.setPosition(positionAtWorld.x, positionAtWorld.y);
      this.buildingPreview.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
      this.buildingPreview.setAlpha(this.isAllowBuild() ? 1.0 : 0.25);
    }
  }

  /**
   * Destroy building preview.
   */
  private destroyBuildingPreview() {
    this.buildingPreview.destroy();
    this.buildingPreview = null;
  }
}

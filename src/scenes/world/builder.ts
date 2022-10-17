import Phaser from 'phaser';
import { BUILDINGS } from '~const/buildings';
import { DIFFICULTY } from '~const/difficulty';
import { TILE_META } from '~const/level';
import { calcGrowth, equalPositions } from '~lib/utils';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { NoticeType } from '~type/screen/notice';
import { BuildingVariant } from '~type/world/entities/building';
import { BiomeType, TileType } from '~type/world/level';

const BUILDING_VARIANTS = Object.values(BuildingVariant);

export class Builder {
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
  private buildArea: Phaser.GameObjects.Ellipse;

  /**
   * Building preview.
   */
  private buildingPreview: Phaser.GameObjects.Image;

  /**
   * Current building variant index.
   */
  private _variantIndex: number = null;

  public get variantIndex() { return this._variantIndex; }

  private set variantIndex(v) { this._variantIndex = v; }

  /**
   * Builder constructor.
   */
  constructor(scene: World) {
    this.scene = scene;

    this.scene.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, this.switchBuildingVariant, this);
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
   * Get building meta parameter.
   *
   * @param param - Parameter key
   */
  public getBuildingMeta(param: string) {
    if (!this.isVariantSelected()) {
      return null;
    }

    const variant = BUILDING_VARIANTS[this.variantIndex];

    return BUILDINGS[variant][param];
  }

  /**
   * Set current building variant.
   */
  public setBuildingVariant(index: number) {
    this.variantIndex = index;

    if (this.buildingPreview) {
      this.buildingPreview.setTexture(this.getBuildingMeta('Texture'));
    }
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
    const { level } = this.scene;

    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        const tileGround = level.getTile({ x, y, z: 0 });

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
          const tile = level.getTileWithType(tilePosition, TileType.TREE);

          if (tile) {
            level.removeTile(tilePosition);
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
    const { worldX, worldY } = this.scene.input.activePointer;

    return Level.ToMatrixPosition({ x: worldX, y: worldY });
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

    const { input } = this.scene;

    input.on(Phaser.Input.Events.POINTER_UP, this.build, this);
    input.on(Phaser.Input.Events.POINTER_MOVE, this.updateBuildingPreview, this);

    this.isBuild = true;
  }

  /**
   * Remove builder interface and disallow build.
   */
  private closeBuilder() {
    if (!this.isBuild) {
      return;
    }

    const { input } = this.scene;

    input.off(Phaser.Input.Events.POINTER_UP, this.build);
    input.off(Phaser.Input.Events.POINTER_MOVE, this.updateBuildingPreview);

    this.destroyBuildingPreview();
    this.destroyBuildArea();

    this.isBuild = false;
  }

  /**
   * Switch current building variant.
   */
  private switchBuildingVariant(e: KeyboardEvent) {
    if (!Number(e.key)) {
      return;
    }

    const index = Number(e.key) - 1;

    if (!BUILDING_VARIANTS[index]) {
      return;
    }

    this.setBuildingVariant(
      (this.variantIndex === index) ? null : index,
    );
  }

  /**
   * Checks if player is stopped and wave not going.
   */
  private isCanBuild(): boolean {
    const { player, wave } = this.scene;

    return (
      this.isVariantSelected()
      && !wave.isGoing
      && !player.live.isDead()
      && player.isStopped()
    );
  }

  /**
   * Checks if allow to build on estimated position.
   */
  private isAllowBuild(): boolean {
    const { player, level } = this.scene;
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
    const tileGround = level.getTile({ ...positionAtMatrix, z: 0 });
    const isSolid = tileGround?.biome.solid;

    if (!isSolid) {
      return false;
    }

    // Pointer is not contains player or other buildings
    const playerPositionsAtMatrix = player.getAllPositionsAtMatrix();
    const isFree = (
      level.isFreePoint(tilePosition)
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
    if (!this.isAllowBuild()) {
      return;
    }

    const variant = BUILDING_VARIANTS[this.variantIndex];
    const BuildingInstance = BUILDINGS[variant];

    const { player } = this.scene;

    if (!player.haveResources(BuildingInstance.Cost)) {
      this.scene.screen.message(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

      return;
    }

    if (BuildingInstance.Limit) {
      const count = this.scene.selectBuildings(variant).length;
      const limit = this.getBuildCurrentLimit(BuildingInstance.Limit);

      if (count >= limit) {
        this.scene.screen.message(NoticeType.ERROR, `YOU HAVE MAXIMUM ${BuildingInstance.Name.toUpperCase()}`);

        return;
      }
    }

    player.takeResources(BuildingInstance.Cost);

    const positionAtMatrix = this.getAssumedPosition();

    new BuildingInstance(this.scene, positionAtMatrix);

    this.updateBuildArea();
  }

  /**
   * Create permitted build area on map.
   */
  private createBuildArea() {
    const { player, difficulty } = this.scene;
    const d = calcGrowth(
      DIFFICULTY.BUILDING_BUILD_AREA / difficulty,
      DIFFICULTY.BUILDING_BUILD_AREA_GROWTH,
      player.level,
    ) * 2;

    this.buildArea = this.scene.add.ellipse(0, 0, d, d * TILE_META.persperctive);
    this.buildArea.setStrokeStyle(2, 0xffffff, 0.4);
    this.updateBuildArea();
  }

  /**
   * Update build area position.
   */
  private updateBuildArea() {
    const { x, y } = this.scene.player.getBottomCenter();
    const out = TILE_META.height * 2;

    this.buildArea.setPosition(x, y);
    this.buildArea.setDepth(Level.GetDepth(y, 1, this.buildArea.height + out));
  }

  /**
   * Destroy build area.
   */
  private destroyBuildArea() {
    this.buildArea.destroy();
    delete this.buildArea;
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
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);

    this.buildingPreview.setPosition(positionAtWorld.x, positionAtWorld.y);
    this.buildingPreview.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.buildingPreview.setAlpha(this.isAllowBuild() ? 1.0 : 0.25);
  }

  /**
   * Destroy building preview.
   */
  private destroyBuildingPreview() {
    this.buildingPreview.destroy();
    delete this.buildingPreview;
  }
}

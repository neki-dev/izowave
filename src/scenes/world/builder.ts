import Phaser from 'phaser';
import { calcGrowth, equalPositions } from '~lib/utils';
import Level from '~scene/world/level';
import World from '~scene/world';

import { AssumedBuildPosition, BuildingVariant } from '~type/building';

import BUILDINGS from '~const/buildings';
import { BUILDING_BUILD_AREA, BUILDING_BUILD_AREA_GROWTH } from '~const/difficulty';
import { TILE_META } from '~const/level';

const BUILDING_VARIANTS = Object.values(BuildingVariant);

export default class Builder {
  readonly scene: World;

  /**
   * Build state.
   */
  private _isBuild: boolean = false;

  public get isBuild() { return this._isBuild; }

  private set isBuild(v) { this._isBuild = v; }

  /**
   * Assumed position state.
   */
  private assumedPosition: AssumedBuildPosition = {
    inArea: false,
    isFree: true,
    isSolid: false,
  };

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

    this.createBuildingPreview();
    this.createBuildArea();

    const { input } = this.scene;
    input.on(Phaser.Input.Events.POINTER_UP, this.build, this);
    input.on(Phaser.Input.Events.POINTER_MOVE, this.updateAssumedPositionState, this);
    this.updateAssumedPositionState();

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
    input.off(Phaser.Input.Events.POINTER_MOVE, this.updateAssumedPositionState);

    this.destroyBuildingPreview();
    this.destroyBuildArea();

    this.isBuild = false;
  }

  /**
   * Switch current building variant.
   */
  private switchBuildingVariant(e) {
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
    const { inArea, isFree, isSolid } = this.assumedPosition;
    return (inArea && isFree && isSolid);
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
      player.addLabel('NOT ENOUGH RESOURCES');
      return;
    }

    player.takeResources(BuildingInstance.Cost);

    const { x, y } = this.getAssumedPosition();
    new BuildingInstance(this.scene, { x, y, z: 1 });

    this.updateAssumedPositionState();
  }

  /**
   * Update state of estimated position.
   * Checks if position not intersects with player or other buildings
   * and if ground is solid.
   */
  private updateAssumedPositionState() {
    const { player, level } = this.scene;
    const positionAtMatrix = this.getAssumedPosition();
    const tilePosition = { ...positionAtMatrix, z: 1 };

    // Pointer position is free
    this.assumedPosition.isFree = (
      level.isFreePoint(tilePosition)
      && !equalPositions(positionAtMatrix, player.positionAtMatrix)
    );
    if (this.assumedPosition.isFree) {
      // Pointer in build area
      const positionAtWorld = Level.ToWorldPosition({ ...positionAtMatrix, z: 0 });
      const offset = this.buildArea.getTopLeft();
      this.assumedPosition.inArea = this.buildArea.geom.contains(positionAtWorld.x - offset.x, positionAtWorld.y - offset.y);
      if (this.assumedPosition.inArea) {
        // Pointer biome is solid
        const tileGround = level.getTile({ ...positionAtMatrix, z: 0 });
        this.assumedPosition.isSolid = tileGround?.biome.solid;
      }
    }

    this.updateBuildingPreview(tilePosition);
  }

  /**
   * Create permitted build area on map.
   */
  private createBuildArea() {
    const { player, difficulty } = this.scene;
    const d = calcGrowth(BUILDING_BUILD_AREA / difficulty, BUILDING_BUILD_AREA_GROWTH, player.level) * 2;
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
    this.assumedPosition.inArea = false;
    this.buildArea.destroy();
    delete this.buildArea;
  }

  /**
   * Create building variant preview on map.
   */
  private createBuildingPreview() {
    const { worldX, worldY } = this.scene.input.activePointer;
    this.buildingPreview = this.scene.add.image(worldX, worldY, this.getBuildingMeta('Texture'));
    this.buildingPreview.setOrigin(0.5, TILE_META.origin);
  }

  /**
   * Update position and visible of building preview.
   *
   * @param position - Tile position
   */
  private updateBuildingPreview(position: Phaser.Types.Math.Vector3Like) {
    this.buildingPreview.setVisible(this.assumedPosition.isFree);
    if (this.buildingPreview.visible) {
      const isAllow = this.isAllowBuild();
      const { x, y } = Level.ToWorldPosition(position);
      this.buildingPreview.setPosition(x, y);
      this.buildingPreview.setDepth(Level.GetTileDepth(y, position.z));
      this.buildingPreview.setAlpha(isAllow ? 1.0 : 0.25);
    }
  }

  /**
   * Destroy building preview.
   */
  private destroyBuildingPreview() {
    this.buildingPreview.destroy();
    delete this.buildingPreview;
  }
}

import { WorldGenerator } from 'gen-biome';
import Phaser from 'phaser';

import {
  TILE_META, LEVEL_BIOMES, LEVEL_SPAWN_POSITIONS_STEP, LEVEL_MAP_SIZE, LEVEL_MAP_HEIGHT,
  LEVEL_MAP_VISIBLE_PART, LEVEL_BIOME_PARAMETERS, LEVEL_BUILDING_PATH_COST, LEVEL_MAP_Z_WEIGHT,
} from '~const/world/level';
import { registerSpriteAssets } from '~lib/assets';
import { World } from '~scene/world';
import {
  BiomeType, LevelBiome, SpawnTarget, LevelTexture, TileType, Vector2D, Vector3D,
} from '~type/world/level';

import { Navigator } from './navigator';
import { TileMatrix } from './tile-matrix';

export class Level extends TileMatrix {
  readonly scene: World;

  /**
   * Map matrix.
   */
  readonly matrix: LevelBiome[][] = [];

  /**
   * Map tiles group.
   */
  private mapTiles: Phaser.GameObjects.Group;

  /**
   * Vegetation tiles group.
   */
  private treesTiles: Phaser.GameObjects.Group;

  /**
   * Visible tiles group.
   */
  private visibleTiles: Phaser.GameObjects.Group;

  /**
   * Path finder.
   */
  private _navigator: Navigator;

  public get navigator() { return this._navigator; }

  private set navigator(v) { this._navigator = v; }

  /**
   * Level constructor.
   */
  constructor(scene: World) {
    super(LEVEL_MAP_SIZE, LEVEL_MAP_HEIGHT);

    const generator = new WorldGenerator<LevelBiome>({
      width: LEVEL_MAP_SIZE,
      height: LEVEL_MAP_SIZE,
    });

    const layer = generator.addLayer(LEVEL_BIOME_PARAMETERS);

    for (const { params, data } of LEVEL_BIOMES) {
      if (params) {
        layer.addBiome(params, data);
      }
    }

    const map = generator.generate();

    this.matrix = map.getMatrix();

    this.scene = scene;
    this.visibleTiles = scene.add.group();

    this.makeMapTiles();
    this.makePathFinder();
    this.makeTrees();
  }

  /**
   * Event update.
   */
  public update() {
    this.updateVisibleTiles();
  }

  /**
   *
   */
  public isFreePoint(position: Vector3D) {
    return !this.getTile(position) || this.tileIs(position, TileType.TREE);
  }

  /**
   * Get spawn positions at matrix.
   *
   * @param target - Spawn target
   */
  public readSpawnPositions(target: SpawnTarget) {
    const positions: Vector2D[] = [];
    const step = LEVEL_SPAWN_POSITIONS_STEP;
    const rand = Math.floor(step / 2);

    for (let sY = step; sY < this.size - step; sY += step) {
      for (let sX = step; sX < this.size - step; sX += step) {
        const x = sX + Phaser.Math.Between(-rand, rand);
        const y = sY + Phaser.Math.Between(-rand, rand);
        const targets = this.matrix[y]?.[x]?.spawn;

        if (targets && targets.includes(target)) {
          positions.push({ x, y });
        }
      }
    }

    return positions;
  }

  /**
   * Hide all tiles.
   */
  public hideTiles() {
    for (let z = 0; z < this.height; z++) {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const tile = this.getTile({ x, y, z });

          if (tile) {
            tile.setVisible(false);
          }
        }
      }
    }
  }

  /**
   * Update area of visible tiles.
   */
  private updateVisibleTiles() {
    const d = Math.max(window.innerWidth, window.innerHeight) * LEVEL_MAP_VISIBLE_PART;
    const center = this.scene.player.getBottomCenter();
    const area = new Phaser.Geom.Ellipse(center.x, center.y, d, d * TILE_META.persperctive);

    for (const tile of <Phaser.GameObjects.Image[]> this.visibleTiles.getChildren()) {
      tile.setVisible(false);
    }
    this.visibleTiles.clear();

    const c = Math.ceil(d / 52);

    for (let z = 0; z < this.height; z++) {
      for (let y = this.scene.player.positionAtMatrix.y - c + 1; y <= this.scene.player.positionAtMatrix.y + c + 1; y++) {
        for (let x = this.scene.player.positionAtMatrix.x - c + 1; x <= this.scene.player.positionAtMatrix.x + c + 1; x++) {
          const tile = this.scene.level.getTile({ x, y, z });

          if (tile && area.contains(tile.x, tile.y)) {
            this.visibleTiles.add(tile);
            tile.setVisible(true);
          }
        }
      }
    }
  }

  /**
   * Update navigation points costs.
   */
  public refreshNavigationMeta() {
    this.navigator.resetPointsCost();

    for (const building of this.scene.getBuildings()) {
      this.navigator.setPointCost(
        building.positionAtMatrix.x,
        building.positionAtMatrix.y,
        LEVEL_BUILDING_PATH_COST,
      );
    }
  }

  /**
   * Add biomes tiles on map.
   */
  private makeMapTiles() {
    const make = (x: number, y: number, biome: LevelBiome) => {
      const variant = Array.isArray(biome.tileIndex)
        ? Phaser.Math.Between(...biome.tileIndex)
        : biome.tileIndex;
      const tilePosition = { x, y, z: biome.z };
      const positionAtWorld = Level.ToWorldPosition(tilePosition);
      const tile = this.scene.add.image(positionAtWorld.x, positionAtWorld.y, LevelTexture.TILESET, variant);

      tile.setOrigin(0.5, TILE_META.origin);
      tile.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
      tile.biome = biome;
      this.putTile(tile, TileType.MAP, tilePosition);
      this.mapTiles.add(tile);
    };

    this.mapTiles = this.scene.add.group();
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const biome = this.matrix[y][x];

        make(x, y, biome);

        // Add tile to hole
        if (biome.z > 1) {
          const z = biome.z - 1;

          if (this.matrix[y + 1]?.[x]?.z !== z || this.matrix[y]?.[x + 1]?.z !== z) {
            const neededBiome = Object.values(LEVEL_BIOMES).find((b) => (b.data.z === z));

            if (neededBiome) {
              make(x, y, neededBiome.data);
            }
          }
        }
      }
    }
  }

  /**
   * Add trees on map.
   */
  private makeTrees() {
    this.treesTiles = this.scene.add.group();

    const positions = this.readSpawnPositions(SpawnTarget.TREE);

    for (let i = 0; i < this.size * 2; i++) {
      const positionAtMatrix = Phaser.Utils.Array.GetRandom(positions);
      const tilePosition = { ...positionAtMatrix, z: 1 };

      if (!this.getTile(tilePosition)) {
        const positionAtWorld = Level.ToWorldPosition({ ...tilePosition, z: 0 });
        const tile = this.scene.add.image(
          positionAtWorld.x,
          positionAtWorld.y + 11,
          LevelTexture.TREE,
          Phaser.Math.Between(0, 3),
        );

        tile.setOrigin(0.5, 1.0);
        tile.setDepth(Level.GetDepth(positionAtWorld.y + 14, tilePosition.z, tile.displayHeight));
        this.putTile(tile, TileType.TREE, tilePosition);
        this.treesTiles.add(tile);
      }
    }
  }

  /**
   * Create path finder.
   */
  private makePathFinder() {
    const grid = this.matrix.map((y) => y.map((x) => Number(x.collide)));

    this.navigator = new Navigator(grid);
  }

  /**
   * Convert world position to matrix position.
   *
   * @param position - Position at world
   */
  static ToMatrixPosition(position: Vector2D) {
    const { width, height, origin } = TILE_META;
    const n = {
      x: (position.x / (width * 0.5)),
      y: (position.y / (height * origin)),
    };
    const convertedPosition: Vector2D = {
      x: Math.round((n.x + n.y) / 2),
      y: Math.round((n.y - n.x) / 2),
    };

    return convertedPosition;
  }

  /**
   * Convert tile position to world position.
   *
   * @param position - Position at matrix or tile position
   */
  static ToWorldPosition(position: Vector3D | Vector2D) {
    const { width, height, origin } = TILE_META;
    const z = 'z' in position ? position.z : 0;
    const convertedPosition: Vector2D = {
      x: (position.x - position.y) * (width * 0.5),
      y: (position.x + position.y) * (height * origin) - (z * (height * 0.5)),
    };

    return convertedPosition;
  }

  /**
   * Get depth for tile.
   *
   * @param y - Tile Y
   * @param z - Tile Z
   */
  static GetTileDepth(y: number, z: number) {
    return y + (z * LEVEL_MAP_Z_WEIGHT);
  }

  /**
   * Get depth dor dynamic sprite.
   *
   * @param y - Tile Y
   * @param z - Tile Z
   * @param height - Sprite height
   */
  static GetDepth(y: number, z: number, height: number) {
    return y + (z * LEVEL_MAP_Z_WEIGHT) - (height / 2);
  }

  /**
   * Get biome by type
   *
   * @param type - Biome type
   */
  static GetBiome(type: BiomeType): Nullable<LevelBiome> {
    return LEVEL_BIOMES.find((biome) => (biome.data.type === type))?.data ?? null;
  }
}

registerSpriteAssets(LevelTexture.TILESET, {
  width: TILE_META.width,
  height: TILE_META.height,
});
registerSpriteAssets(LevelTexture.TREE, {
  width: TILE_META.width,
  height: TILE_META.height * 1.5,
});

import GenBiome from 'gen-biome';
import Phaser from 'phaser';

import {
  TILE_META, LEVEL_BIOMES, LEVEL_SPAWN_POSITIONS_STEP,
  LEVEL_MAP_SIZE, LEVEL_MAP_HEIGHT, LEVEL_MAP_VISIBLE_PART, LEVEL_BIOME_PARAMETERS,
} from '~const/level';
import { registerAssets } from '~lib/assets';
import { World } from '~scene/world';
import {
  BiomeType, LevelBiome, SpawnTarget, LevelTexture, TileType,
} from '~type/world/level';

import { Navigator } from './navigator';
import { TileMatrix } from './tile-matrix';

export class Level extends TileMatrix {
  readonly scene: World;

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
   * Map matrix.
   */
  private matrix: LevelBiome[][];

  /**
   * Path finder.
   */
  private _navigator: Navigator;

  public get navigator() {
    return this._navigator;
  }

  private set navigator(v) {
    this._navigator = v;
  }

  /**
   * Level constructor.
   */
  constructor(scene: World) {
    super(LEVEL_MAP_SIZE, LEVEL_MAP_HEIGHT);

    const map = new GenBiome<LevelBiome>({
      width: LEVEL_MAP_SIZE,
      height: LEVEL_MAP_SIZE,
      layers: [{
        parameters: LEVEL_BIOME_PARAMETERS,
        biomes: LEVEL_BIOMES,
      }],
    });

    map.generate();
    this.matrix = map.getMatrix();

    this.scene = scene;
    this.visibleTiles = scene.add.group();

    this.makeMapTiles();
    this.makePathFinder();
    this.makeTrees();
  }

  /**
   * Update event.
   */
  public update() {
    this.updateVisibleTiles();
  }

  /**
   *
   */
  public isFreePoint(position: Phaser.Types.Math.Vector3Like) {
    return !this.getTile(position) || this.tileIs(position, TileType.TREE);
  }

  /**
   * Get spawn positions at matrix.
   *
   * @param target - Spawn target
   */
  public readSpawnPositions(target: SpawnTarget): Phaser.Types.Math.Vector2Like[] {
    const positions = [];
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
    const { player, level } = this.scene;
    const d = Math.max(window.innerWidth, window.innerHeight) * LEVEL_MAP_VISIBLE_PART;
    const center = player.getBottomCenter();
    const area = new Phaser.Geom.Ellipse(center.x, center.y, d, d * TILE_META.persperctive);

    this.visibleTiles.children.iterate((tile: Phaser.GameObjects.Image) => {
      tile.setVisible(false);
    });
    this.visibleTiles.clear();

    const { x, y } = player.positionAtMatrix;
    const c = Math.ceil(d / 52);

    for (let z = 0; z < this.height; z++) {
      for (let iy = y - c + 1; iy <= y + c + 1; iy++) {
        for (let ix = x - c + 1; ix <= x + c + 1; ix++) {
          const tile = level.getTile({ x: ix, y: iy, z });

          if (tile && area.contains(tile.x, tile.y)) {
            this.visibleTiles.add(tile);
            tile.setVisible(true);
          }
        }
      }
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

            make(x, y, neededBiome.data);
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
  static ToMatrixPosition(position: Phaser.Types.Math.Vector2Like): Phaser.Types.Math.Vector3Like {
    const { halfWidth, halfHeight } = TILE_META;
    const n = {
      x: (position.x / halfWidth),
      y: (position.y / (halfHeight / 2)),
    };

    return {
      x: Math.round((n.x + n.y) / 2),
      y: Math.round((n.y - n.x) / 2),
    };
  }

  /**
   * Convert tile position to world position.
   *
   * @param position - Position at matrix or tile position
   */
  static ToWorldPosition(position: Phaser.Types.Math.Vector3Like): Phaser.Types.Math.Vector2Like {
    const { halfWidth, halfHeight } = TILE_META;

    return {
      x: (position.x - position.y) * halfWidth,
      y: (position.x + position.y) * (halfHeight / 2) - ((position.z || 0) * halfHeight),
    };
  }

  /**
   * Get depth for tile.
   *
   * @param y - Tile Y
   * @param z - Tile Z
   */
  static GetTileDepth(y: number, z: number): number {
    const { origin, height, halfHeight } = TILE_META;

    return Level.GetDepth(y + (height * origin) + (halfHeight / 2), z, height);
  }

  /**
   * Get depth dor dynamic sprite.
   *
   * @param y - Tile Y
   * @param z - Tile Z
   * @param height - Sprite height
   */
  static GetDepth(y: number, z: number, height: number): number {
    const weightZ = 999;

    return y + (z * weightZ) - (height / 2);
  }

  /**
   * Get biome by type
   *
   * @param type - Biome type
   */
  static GetBiome(type: BiomeType): LevelBiome {
    return LEVEL_BIOMES.find((biome) => (biome.data.type === type))?.data || null;
  }
}

registerAssets([{
  key: LevelTexture.TILESET,
  type: 'spritesheet',
  url: `assets/sprites/${LevelTexture.TILESET}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: TILE_META.width,
    frameHeight: TILE_META.height,
  },
}, {
  key: LevelTexture.TREE,
  type: 'spritesheet',
  url: `assets/sprites/${LevelTexture.TREE}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: TILE_META.width,
    frameHeight: TILE_META.height + TILE_META.halfHeight,
  },
}]);

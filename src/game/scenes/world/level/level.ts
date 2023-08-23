import { World, WorldGenerator } from 'gen-biome';
import Phaser from 'phaser';

import {
  LEVEL_TILE_SIZE, LEVEL_MAP_SIZE, LEVEL_MAP_MAX_HEIGHT,
  LEVEL_BIOME_PARAMETERS, LEVEL_SCENERY_TILE_SIZE, LEVEL_PLANETS, LEVEL_SEED_SIZE,
} from '~const/world/level';
import { registerSpriteAssets } from '~lib/assets';
import { Navigator } from '~lib/navigator';
import { interpolate } from '~lib/utils';
import { Effect } from '~scene/world/effects';
import { GameEvents, GameSettings } from '~type/game';
import { INavigator } from '~type/navigator';
import { IWorld } from '~type/world';
import {
  BiomeType, LevelBiome, SpawnTarget, LevelSceneryTexture, TileType,
  Vector2D, Vector3D, ILevel, LevelTilesetTexture, LevelPlanet, LevelSavePayload, LevelData,
} from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

import { TileMatrix } from './tile-matrix';

export class Level extends TileMatrix implements ILevel {
  readonly scene: IWorld;

  readonly navigator: INavigator;

  readonly map: World<LevelBiome>;

  readonly planet: LevelPlanet;

  readonly gridCollide: boolean[][] = [];

  readonly gridSolid: boolean[][] = [];

  private _effectsOnGround: Effect[] = [];

  public get effectsOnGround() { return this._effectsOnGround; }

  private set effectsOnGround(v) { this._effectsOnGround = v; }

  private _groundLayer: Phaser.Tilemaps.TilemapLayer;

  public get groundLayer() { return this._groundLayer; }

  private set groundLayer(v) { this._groundLayer = v; }

  private sceneryTiles: Phaser.GameObjects.Group;

  constructor(scene: IWorld, { planet, seed }: LevelData) {
    super(LEVEL_MAP_SIZE, LEVEL_MAP_MAX_HEIGHT);

    this.scene = scene;
    this.planet = planet ?? LevelPlanet.EARTH;

    const generator = new WorldGenerator<LevelBiome>({
      width: LEVEL_MAP_SIZE,
      height: LEVEL_MAP_SIZE,
    });

    const layer = generator.addLayer(LEVEL_BIOME_PARAMETERS);

    LEVEL_PLANETS[this.planet].BIOMES.forEach((biome) => {
      if (biome.params) {
        layer.addBiome(biome.params, biome.data);
      }
    });

    this.map = generator.generate({
      seed,
      seedSize: LEVEL_SEED_SIZE,
    });

    this.gridCollide = this.map.getMatrix().map((y) => y.map((x) => x.collide));
    this.gridSolid = this.map.getMatrix().map((y) => y.map((x) => !x.solid));

    this.navigator = new Navigator();

    this.addTilemap();
    this.addMapTiles();
    this.addScenery();

    this.scene.game.events.on(`${GameEvents.UPDATE_SETTINGS}.${GameSettings.EFFECTS}`, (value: string) => {
      if (value === 'off') {
        this.removeEffects();
      }
    });
  }

  public looseEffects() {
    this.effectsOnGround.forEach((effect) => {
      effect.setAlpha(effect.alpha - 0.2);
      if (effect.alpha <= 0) {
        effect.destroy();
      }
    });
  }

  private removeEffects() {
    this.effectsOnGround.forEach((effect) => {
      effect.destroy();
    });
    this.effectsOnGround = [];
  }

  public readSpawnPositions(target: SpawnTarget, grid: number = 2) {
    const positions: Vector2D[] = [];
    const rand = Math.floor(grid / 2);

    for (let sX = grid; sX < this.map.width - grid; sX += grid) {
      for (let sY = grid; sY < this.map.height - grid; sY += grid) {
        const x = sX + Phaser.Math.Between(-rand, rand);
        const y = sY + Phaser.Math.Between(-rand, rand);
        const targets = this.map.getAt({ x, y })?.spawn;

        if (targets && targets.includes(target)) {
          positions.push({ x, y });
        }
      }
    }

    return positions;
  }

  public hasTilesBetweenPositions(positionA: Vector2D, positionB: Vector2D) {
    const positionAtMatrixA = Level.ToMatrixPosition(positionA);
    const positionAtMatrixB = Level.ToMatrixPosition(positionB);
    const line = interpolate(positionAtMatrixA, positionAtMatrixB);

    return line.some((point) => this.getTile({ ...point, z: 1 })?.tileType === TileType.MAP);
  }

  public getBiome(type: BiomeType): Nullable<LevelBiome> {
    return LEVEL_PLANETS[this.planet].BIOMES.find((biome) => (biome.data.type === type))?.data ?? null;
  }

  private addTilemap() {
    const data = new Phaser.Tilemaps.MapData({
      width: LEVEL_MAP_SIZE,
      height: LEVEL_MAP_SIZE,
      tileWidth: LEVEL_TILE_SIZE.width,
      tileHeight: LEVEL_TILE_SIZE.height * 0.5,
      orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
      format: Phaser.Tilemaps.Formats.ARRAY_2D,
    });

    const tilemap = new Phaser.Tilemaps.Tilemap(this.scene, data);
    const tileset = tilemap.addTilesetImage(
      LevelTilesetTexture[this.planet],
      undefined,
      LEVEL_TILE_SIZE.width,
      LEVEL_TILE_SIZE.height,
    );

    if (!tileset) {
      throw Error('Unable to create map tileset');
    }

    this.addFalloffLayer(tilemap, tileset);
    this.addGroundLayer(tilemap, tileset);
  }

  private addGroundLayer(tilemap: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    const layer = tilemap.createBlankLayer(
      'ground',
      tileset,
      -LEVEL_TILE_SIZE.width * 0.5,
      -LEVEL_TILE_SIZE.height * LEVEL_TILE_SIZE.origin,
    );

    if (!layer) {
      throw Error('Unable to create map layer');
    }

    this.groundLayer = layer;
  }

  private addFalloffLayer(tilemap: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) {
    const sizeInPixel = Math.max(this.scene.sys.canvas.clientWidth, this.scene.sys.canvas.clientHeight) * 0.5;
    const offset = Math.ceil(sizeInPixel / (LEVEL_TILE_SIZE.height * 0.5));
    const sizeInTiles = offset * 2 + LEVEL_MAP_SIZE;
    const position = Level.ToWorldPosition({ x: -offset, y: -offset, z: 0 });

    const layer = tilemap.createBlankLayer(
      'falloff',
      tileset,
      position.x - LEVEL_TILE_SIZE.width * 0.5,
      position.y - LEVEL_TILE_SIZE.height * LEVEL_TILE_SIZE.origin,
      sizeInTiles,
      sizeInTiles,
    );

    if (!layer) {
      return;
    }

    const biome = this.getBiome(BiomeType.WATER);

    if (!biome) {
      return;
    }

    const index = Array.isArray(biome.tileIndex)
      ? biome.tileIndex[0]
      : biome.tileIndex;

    for (let y = 0; y < sizeInTiles; y++) {
      for (let x = 0; x < sizeInTiles; x++) {
        if (x < offset || x >= sizeInTiles - offset || y < offset || y >= sizeInTiles - offset) {
          layer.putTileAt(index, x, y, false);
        }
      }
    }
  }

  private addMapTiles() {
    const addTile = (position: Vector2D, biome: LevelBiome) => {
      const index = Array.isArray(biome.tileIndex)
        ? Phaser.Math.Between(...biome.tileIndex)
        : biome.tileIndex;

      if (biome.z === 0) {
        // Add tile to static tilemap layer
        this.groundLayer.putTileAt(index, position.x, position.y, false);
      } else {
        // Add tile as image
        // Need for correct calculate depth
        this.addMountTile(index, { ...position, z: biome.z });
      }
    };

    this.map.each((position, biome) => {
      addTile(position, biome);

      // Add tile to hole
      if (biome.z > 1) {
        const z = biome.z - 1;
        const shiftX = this.map.getAt({ x: position.x + 1, y: position.y });
        const shiftY = this.map.getAt({ x: position.x, y: position.y + 1 });

        if ((shiftX && shiftX.z !== z) || (shiftY && shiftY.z !== z)) {
          const patch = LEVEL_PLANETS[this.planet].BIOMES.find((b) => (b.data.z === z));

          if (patch) {
            addTile(position, patch.data);
          }
        }
      }
    });
  }

  private addMountTile(index: number, tilePosition: Vector3D) {
    const positionAtWorld = Level.ToWorldPosition(tilePosition);
    const tile = this.scene.add.image(
      positionAtWorld.x,
      positionAtWorld.y,
      LevelTilesetTexture[this.planet],
      index,
    ) as ITile;

    tile.tileType = TileType.MAP;

    tile.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    tile.setOrigin(0.5, LEVEL_TILE_SIZE.origin);
    this.putTile(tile, tilePosition, false);
  }

  private addScenery() {
    this.sceneryTiles = this.scene.add.group();

    const positions = this.readSpawnPositions(SpawnTarget.SCENERY);
    const count = Math.ceil(LEVEL_MAP_SIZE * LEVEL_PLANETS[this.planet].SCENERY_DENSITY);

    for (let i = 0; i < count; i++) {
      const positionAtMatrix: Vector2D = Phaser.Utils.Array.GetRandom(positions);
      const tilePosition: Vector3D = { ...positionAtMatrix, z: 1 };

      if (this.isFreePoint(tilePosition)) {
        const positionAtWorld = Level.ToWorldPosition(tilePosition);
        const tile = this.scene.add.image(
          positionAtWorld.x,
          positionAtWorld.y,
          LevelSceneryTexture[this.planet],
          Phaser.Math.Between(0, LEVEL_PLANETS[this.planet].SCENERY_VARIANTS - 1),
        ) as ITile;

        tile.tileType = TileType.SCENERY;
        tile.clearable = true;

        tile.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
        tile.setOrigin(0.5, LEVEL_SCENERY_TILE_SIZE.origin);
        this.putTile(tile, tilePosition);
        this.sceneryTiles.add(tile);
      }
    }
  }

  public getSavePayload(): LevelSavePayload {
    return {
      planet: this.planet,
      seed: this.map.seed,
    };
  }

  static ToMatrixPosition(positionAtWorld: Vector2D) {
    const { width, height, origin } = LEVEL_TILE_SIZE;
    const n = {
      x: (positionAtWorld.x / (width * 0.5)),
      y: (positionAtWorld.y / (height * origin)),
    };
    const positionAtMatrix: Vector2D = {
      x: Math.round((n.x + n.y) / 2),
      y: Math.round((n.y - n.x) / 2),
    };

    return positionAtMatrix;
  }

  static ToWorldPosition(tilePosition: Vector3D) {
    const { width, height, origin } = LEVEL_TILE_SIZE;
    const positionAtWorld: Vector2D = {
      x: (tilePosition.x - tilePosition.y) * (width * 0.5),
      y: (tilePosition.x + tilePosition.y) * (height * origin) - (tilePosition.z * (height * 0.5)),
    };

    return positionAtWorld;
  }

  static GetDepth(YAtWorld: number, tileZ: number, offset: number = 0) {
    return YAtWorld + (tileZ * LEVEL_TILE_SIZE.height) + offset;
  }

  static GetTileDepth(YAtWorld: number, tileZ: number) {
    return YAtWorld + (tileZ * LEVEL_TILE_SIZE.height) + LEVEL_TILE_SIZE.height * 0.5;
  }
}

registerSpriteAssets(LevelTilesetTexture, LEVEL_TILE_SIZE);
registerSpriteAssets(LevelSceneryTexture, LEVEL_SCENERY_TILE_SIZE);

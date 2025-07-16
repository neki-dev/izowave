import { WorldGenerator } from 'gen-biome';
import type { World } from 'gen-biome';
import Phaser from 'phaser';

import type { Effect } from '../fx-manager/effect';

import {
  LEVEL_MAP_TILE,
  LEVEL_MAP_SIZE,
  LEVEL_MAP_MAX_HEIGHT,
  LEVEL_BIOME_PARAMETERS,
  LEVEL_SCENERY_TILE,
  LEVEL_PLANETS,
  LEVEL_SEED_SIZE,
  LEVEL_MAP_PERSPECTIVE,
} from './const';
import { TileMatrix } from './tile-matrix';
import type { ITile } from './tile-matrix/types';
import type {
  BiomeType,
  LevelBiome,
  LevelData,
  LevelSavePayload,
  PositionAtMatrix,
  PositionAtWorld,
  TilePosition,
} from './types';
import {
  LevelPlanet,
  LevelSceneryTexture,
  LevelTilesetTexture,
  SpawnTarget,
  TileType,
} from './types';

import { isPositionsEqual } from '~core/dimension';
import { Navigator } from '~core/navigator';
import type { Scene } from '~game/scenes';
import { GameEvent, GameSettings } from '~game/types';

import './resources';

export class Level extends TileMatrix {
  public readonly scene: Scene;

  public readonly navigator: Navigator;

  public readonly map: World<LevelBiome>;

  public readonly planet: LevelPlanet;

  public readonly gridCollide: boolean[][] = [];

  public readonly gridSolid: boolean[][] = [];

  private _effectsOnGround: Effect[] = [];
  public get effectsOnGround() { return this._effectsOnGround; }
  private set effectsOnGround(v) { this._effectsOnGround = v; }

  private _groundLayer: Phaser.Tilemaps.TilemapLayer;
  public get groundLayer() { return this._groundLayer; }
  private set groundLayer(v) { this._groundLayer = v; }

  private tilemap: Phaser.Tilemaps.Tilemap;

  constructor(scene: Scene, { planet, seed }: LevelData) {
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

    this.scene.game.events.on(`${GameEvent.UPDATE_SETTINGS}.${GameSettings.EFFECTS}`, (value: string) => {
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
    const positions: PositionAtMatrix[] = [];

    for (let sX = grid; sX < this.map.width - grid; sX += grid) {
      for (let sY = grid; sY < this.map.height - grid; sY += grid) {
        const position = {
          x: sX + Phaser.Math.Between(-1, 1),
          y: sY + Phaser.Math.Between(-1, 1),
          z: 1,
        };
        const targets = this.map.getAt(position)?.spawn;

        if (targets && targets.includes(target)) {
          positions.push(position);
        }
      }
    }

    return positions;
  }

  public hasTilesBetweenPositions(positionA: PositionAtWorld, positionB: PositionAtWorld) {
    const positionAtMatrixA = Level.ToMatrixPosition(positionA);
    const positionAtMatrixB = Level.ToMatrixPosition(positionB);
    const current: TilePosition = { ...positionAtMatrixA, z: 1 };
    const dx = Math.abs(positionAtMatrixB.x - positionAtMatrixA.x);
    const dy = Math.abs(positionAtMatrixB.y - positionAtMatrixA.y);
    let err = dx - dy;

    while (!isPositionsEqual(current, positionAtMatrixB)) {
      const shift = 2 * err;

      if (shift > -dy) {
        err -= dy;
        current.x += (positionAtMatrixA.x < positionAtMatrixB.x) ? 1 : -1;
      }
      if (shift < dx) {
        err += dx;
        current.y += (positionAtMatrixA.y < positionAtMatrixB.y) ? 1 : -1;
      }

      if (this.getTile(current)?.tileType === TileType.MAP) {
        return true;
      }
    }

    return false;
  }

  public getBiome(type: BiomeType): Nullable<LevelBiome> {
    return LEVEL_PLANETS[this.planet].BIOMES.find((biome) => (biome.data.type === type))?.data ?? null;
  }

  public getFreeAdjacentTiles(position: PositionAtMatrix) {
    const positions: PositionAtMatrix[] = [
      { x: position.x + 1, y: position.y },
      { x: position.x, y: position.y + 1 },
      { x: position.x - 1, y: position.y },
      { x: position.x, y: position.y - 1 },
      { x: position.x + 1, y: position.y - 1 },
      { x: position.x + 1, y: position.y + 1 },
      { x: position.x - 1, y: position.y + 1 },
      { x: position.x - 1, y: position.y - 1 },
    ];

    return positions.filter((point) => this.isFreePoint({ ...point, z: 1 }));
  }

  private addTilemap() {
    const data = new Phaser.Tilemaps.MapData({
      width: LEVEL_MAP_SIZE,
      height: LEVEL_MAP_SIZE,
      tileWidth: LEVEL_MAP_TILE.width,
      tileHeight: LEVEL_MAP_TILE.height * 0.5,
      orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
      format: Phaser.Tilemaps.Formats.ARRAY_2D,
    });

    this.tilemap = new Phaser.Tilemaps.Tilemap(this.scene, data);
    const tileset = this.tilemap.addTilesetImage(
      LevelTilesetTexture[this.planet],
      undefined,
      LEVEL_MAP_TILE.width,
      LEVEL_MAP_TILE.height,
      LEVEL_MAP_TILE.margin,
      LEVEL_MAP_TILE.spacing,
    );

    if (!tileset) {
      throw Error('Unable to create map tileset');
    }

    this.addFalloffLayer(tileset);
    this.addGroundLayer(tileset);
  }

  private addGroundLayer(tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tilemap.createBlankLayer(
      'ground',
      tileset,
      -LEVEL_MAP_TILE.width * 0.5,
      -LEVEL_MAP_TILE.height * 0.25,
    );

    if (!layer) {
      throw Error('Unable to create map layer');
    }

    this.groundLayer = layer;
  }

  private addFalloffLayer(tileset: Phaser.Tilemaps.Tileset) {
    const tileAngle = Math.atan2(1 / LEVEL_MAP_PERSPECTIVE, 1);
    const visibleDiagonal = (this.scene.game.canvas.clientWidth / 2) / Math.sin(tileAngle);
    const edgeSize = Math.ceil(visibleDiagonal / LEVEL_MAP_TILE.edgeLength);
    const sizeInTiles = (edgeSize * 2) + LEVEL_MAP_SIZE;
    const position = Level.ToWorldPosition({ x: -edgeSize, y: -edgeSize }, 0);

    const layer = this.tilemap.createBlankLayer(
      'falloff',
      tileset,
      position.x - LEVEL_MAP_TILE.width * 0.5,
      position.y - LEVEL_MAP_TILE.height * LEVEL_MAP_TILE.origin,
      sizeInTiles,
      sizeInTiles,
    );

    if (!layer) {
      return;
    }

    const biome = LEVEL_PLANETS[this.planet].BIOMES[0].data;
    const index = Array.isArray(biome.tileIndex)
      ? biome.tileIndex[0]
      : biome.tileIndex;

    for (let y = 0; y < sizeInTiles; y++) {
      for (let x = 0; x < sizeInTiles; x++) {
        if (
          x < edgeSize
          || x >= sizeInTiles - edgeSize
          || y < edgeSize
          || y >= sizeInTiles - edgeSize
        ) {
          layer.putTileAt(index, x, y, false);
        }
      }
    }
  }

  private addMapTiles() {
    const addTile = (position: PositionAtMatrix, biome: LevelBiome) => {
      const index = Array.isArray(biome.tileIndex)
        ? Phaser.Math.Between(...biome.tileIndex)
        : biome.tileIndex;

      if (biome.z === 0) {
        // Add tile to static tilemap layer
        this.groundLayer.putTileAt(index, position.x, position.y, false);
      } else {
        // Add tile as image
        // Need for correct calculate depth
        this.addMountTile(index, position, biome.z);
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

  private addMountTile(index: number, position: PositionAtMatrix, z: number) {
    const positionAtWorld = Level.ToWorldPosition(position, z);
    const depth = positionAtWorld.y + ((z - 1) * LEVEL_MAP_TILE.height);
    const tile = this.scene.add.image(
      positionAtWorld.x,
      positionAtWorld.y,
      LevelTilesetTexture[this.planet],
      index,
    ) as ITile;

    tile.tileType = TileType.MAP;

    tile.setDepth(depth);
    tile.setOrigin(0.5, LEVEL_MAP_TILE.origin);
    this.putTile(tile, { ...position, z }, false);
  }

  private addScenery() {
    const positions = this.readSpawnPositions(SpawnTarget.SCENERY);
    const count = Math.ceil(LEVEL_MAP_SIZE * LEVEL_PLANETS[this.planet].SCENERY_DENSITY);

    for (let i = 0; i < count; i++) {
      const positionAtMatrix = Phaser.Utils.Array.GetRandom(positions);
      const tilePosition: TilePosition = { ...positionAtMatrix, z: 1 };

      if (this.isFreePoint(tilePosition)) {
        const positionAtWorld = Level.ToWorldPosition(positionAtMatrix);
        const tile = this.scene.add.image(
          positionAtWorld.x,
          positionAtWorld.y,
          LevelSceneryTexture[this.planet],
          Phaser.Math.Between(0, LEVEL_PLANETS[this.planet].SCENERY_VARIANTS_COUNT - 1),
        ) as ITile;

        tile.tileType = TileType.SCENERY;
        tile.clearable = true;

        tile.setDepth(positionAtWorld.y);
        tile.setOrigin(0.5, LEVEL_SCENERY_TILE.origin);
        this.putTile(tile, tilePosition);
      }
    }
  }

  public getSavePayload(): LevelSavePayload {
    return {
      planet: this.planet,
      seed: this.map.seed,
    };
  }

  static ToMatrixPosition(position: PositionAtWorld): PositionAtMatrix {
    const { width, height } = LEVEL_MAP_TILE;
    const n = {
      x: (position.x / (width * 0.5)),
      y: (position.y / (height * 0.25)),
    };

    return {
      x: Math.round((n.x + n.y) / 2),
      y: Math.round((n.y - n.x) / 2),
    };
  }

  static ToWorldPosition(position: PositionAtMatrix, z: number = 1): PositionAtWorld {
    const { width, height } = LEVEL_MAP_TILE;

    return {
      x: (position.x - position.y) * (width * 0.5),
      y: (position.x + position.y) * (height * 0.25) - ((z - 1) * (height * 0.5)),
    };
  }
}

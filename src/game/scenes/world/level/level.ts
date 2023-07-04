import { World, WorldGenerator } from 'gen-biome';
import Phaser from 'phaser';

import {
  TILE_META, LEVEL_BIOMES, LEVEL_SPAWN_POSITIONS_STEP, LEVEL_MAP_SIZE, LEVEL_MAP_HEIGHT,
  LEVEL_MAP_VISIBLE_PART, LEVEL_BIOME_PARAMETERS, LEVEL_MAP_Z_WEIGHT, LEVEL_TREES_COUNT,
} from '~const/world/level';
import { registerSpriteAssets } from '~lib/assets';
import { Hexagon } from '~scene/world/hexagon';
import { GameEvents, GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import {
  BiomeType, LevelBiome, SpawnTarget, LevelTexture, TileType, Vector2D, Vector3D, ILevel,
} from '~type/world/level';
import { INavigator } from '~type/world/level/navigator';
import { ITile } from '~type/world/level/tile-matrix';

import { Navigator } from './navigator';
import { TileMatrix } from './tile-matrix';

export class Level extends TileMatrix implements ILevel {
  readonly scene: IWorld;

  readonly navigator: INavigator;

  readonly map: World<LevelBiome>;

  private visibleTiles: Phaser.GameObjects.Group;

  private mapTiles: Phaser.GameObjects.Group;

  private treesTiles: Phaser.GameObjects.Group;

  constructor(scene: IWorld) {
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

    this.map = generator.generate();

    this.scene = scene;
    this.visibleTiles = scene.add.group();

    const grid = this.map.getMatrix().map((y) => y.map((x) => Number(x.collide)));

    this.navigator = new Navigator(grid);

    this.makeMapTiles();
    this.makeTrees();

    this.scene.game.events.on(`${GameEvents.UPDATE_SETTINGS}.${GameSettings.BLOOD_ON_MAP}`, (value: string) => {
      if (value === 'off') {
        this.removeEffects();
      }
    });
  }

  public looseEffects() {
    this.mapTiles.getChildren().forEach((tile: ITile) => {
      tile.mapEffects?.forEach((effect) => {
        effect.setAlpha(effect.alpha - 0.2);
        if (effect.alpha <= 0) {
          effect.destroy();
        }
      });
    });
  }

  private removeEffects() {
    this.mapTiles.getChildren().forEach((tile: ITile) => {
      tile.mapEffects?.forEach((effect) => {
        effect.destroy();
      });
      // eslint-disable-next-line no-param-reassign
      tile.mapEffects = [];
    });
  }

  public isFreePoint(position: Vector3D) {
    return !this.getTile(position) || this.tileIs(position, TileType.TREE);
  }

  public readSpawnPositions(target: SpawnTarget) {
    const positions: Vector2D[] = [];
    const step = LEVEL_SPAWN_POSITIONS_STEP;
    const rand = Math.floor(step / 2);

    for (let sX = step; sX < this.size - step; sX += step) {
      for (let sY = step; sY < this.size - step; sY += step) {
        const x = sX + Phaser.Math.Between(-rand, rand);
        const y = sY + Phaser.Math.Between(-rand, rand);
        const targets = this.map.getAt({ x, y }).spawn;

        if (targets && targets.includes(target)) {
          positions.push({ x, y });
        }
      }
    }

    return positions;
  }

  public hideTiles() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.height; z++) {
          const tile = this.getTile({ x, y, z });

          if (tile) {
            tile.setVisible(false);
            tile.mapEffects?.forEach((effect) => {
              effect.setVisible(false);
            });
          }
        }
      }
    }
  }

  public hasTilesBetweenPositions(positionA: Vector2D, positionB: Vector2D) {
    const tiles = (<ITile[]> this.mapTiles.getChildren())
      .filter((tile) => (tile.biome.z === 1))
      .map((tile) => tile.shape);
    const line = new Phaser.Geom.Line(positionA.x, positionA.y, positionB.x, positionB.y);
    const point = Phaser.Geom.Intersects.GetLineToPolygon(line, tiles);

    return Boolean(point);
  }

  public updateVisibleTiles() {
    const d = Math.max(window.innerWidth, window.innerHeight) * LEVEL_MAP_VISIBLE_PART;
    const c = Math.ceil(d / 52);
    const center = this.scene.player.getBottomCenter();
    const area = new Phaser.Geom.Ellipse(center.x, center.y, d, d * TILE_META.persperctive);

    this.visibleTiles.getChildren().forEach((tile: ITile) => {
      tile.setVisible(false);
      tile.mapEffects?.forEach((effect) => {
        effect.setVisible(false);
      });
    });
    this.visibleTiles.clear();

    for (let z = 0; z < this.height; z++) {
      for (let y = this.scene.player.positionAtMatrix.y - c + 1; y <= this.scene.player.positionAtMatrix.y + c + 1; y++) {
        for (let x = this.scene.player.positionAtMatrix.x - c + 1; x <= this.scene.player.positionAtMatrix.x + c + 1; x++) {
          const tile = this.scene.level.getTile({ x, y, z });

          if (tile && area.contains(tile.x, tile.y)) {
            this.visibleTiles.add(tile);
            tile.setVisible(true);
            tile.mapEffects?.forEach((effect) => {
              effect.setVisible(true);
            });
          }
        }
      }
    }
  }

  private makeMapTiles() {
    const make = (position: Vector2D, biome: LevelBiome) => {
      const variant = Array.isArray(biome.tileIndex)
        ? Phaser.Math.Between(...biome.tileIndex)
        : biome.tileIndex;
      const tilePosition: Vector3D = { ...position, z: biome.z };
      const positionAtWorld = Level.ToWorldPosition(tilePosition);
      const tile = this.scene.add.image(positionAtWorld.x, positionAtWorld.y, LevelTexture.TILESET, variant) as ITile;

      tile.tileType = TileType.MAP;
      tile.mapEffects = [];
      tile.biome = biome;

      tile.setOrigin(0.5, TILE_META.origin);
      tile.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
      this.putTile(tile, tilePosition, false);
      this.mapTiles.add(tile);

      if (biome.z === 1) {
        tile.shape = new Hexagon(
          positionAtWorld.x - TILE_META.width * 0.5 - 3,
          positionAtWorld.y - TILE_META.height * 0.25,
          TILE_META.height * 0.5,
        );
      }
    };

    this.mapTiles = this.scene.add.group();
    this.map.each((position, biome) => {
      make(position, biome);

      // Add tile to hole
      if (biome.z > 1) {
        const z = biome.z - 1;
        const insideMap = (position.x + 1 < this.map.width && position.y + 1 < this.map.height);

        if (insideMap && (
          this.map.getAt({ x: position.x, y: position.y + 1 }).z !== z
          || this.map.getAt({ x: position.x + 1, y: position.y }).z !== z
        )) {
          const neededBiome = LEVEL_BIOMES.find((b) => (b.data.z === z));

          if (neededBiome) {
            make(position, neededBiome.data);
          }
        }
      }
    });
  }

  private makeTrees() {
    this.treesTiles = this.scene.add.group();

    const positions = this.readSpawnPositions(SpawnTarget.TREE);

    for (let i = 0; i < LEVEL_TREES_COUNT; i++) {
      const positionAtMatrix: Vector2D = Phaser.Utils.Array.GetRandom(positions);
      const tilePosition: Vector3D = { ...positionAtMatrix, z: 1 };

      if (!this.getTile(tilePosition)) {
        const positionAtWorld = Level.ToWorldPosition(tilePosition);
        const tile = this.scene.add.image(
          positionAtWorld.x,
          positionAtWorld.y - 19,
          LevelTexture.TREE,
          Phaser.Math.Between(0, 3),
        ) as ITile;

        // @ts-ignore
        tile.tileType = TileType.TREE;

        // Configure tile
        tile.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
        tile.setOrigin(0.5, TILE_META.origin);
        this.putTile(tile, tilePosition);
        this.treesTiles.add(tile);
      }
    }
  }

  static ToMatrixPosition(positionAtWorld: Vector2D) {
    const { width, height, origin } = TILE_META;
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
    const { width, height, origin } = TILE_META;
    const positionAtWorld: Vector2D = {
      x: (tilePosition.x - tilePosition.y) * (width * 0.5),
      y: (tilePosition.x + tilePosition.y) * (height * origin) - (tilePosition.z * (height * 0.5)),
    };

    return positionAtWorld;
  }

  static GetTileDepth(YAtWorld: number, tileZ: number) {
    return YAtWorld + (tileZ * LEVEL_MAP_Z_WEIGHT) + TILE_META.height;
  }

  // TODO: Fix depth for large sprites
  static GetDepth(YAtWorld: number, tileZ: number, height: number) {
    return YAtWorld + (tileZ * LEVEL_MAP_Z_WEIGHT) + height;
  }

  static GetBiome(type: BiomeType): Nullable<LevelBiome> {
    return LEVEL_BIOMES.find((biome) => (biome.data.type === type))?.data ?? null;
  }
}

registerSpriteAssets(LevelTexture.TILESET, TILE_META);
registerSpriteAssets(LevelTexture.TREE, {
  width: TILE_META.width,
  height: TILE_META.height * 1.5,
});

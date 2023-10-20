import {
  SPAWN_CACHE_RESET_DISTANCE,
  SPAWN_DISTANCE_FROM_BUILDING,
  SPAWN_DISTANCE_FROM_PLAYER,
  SPAWN_POSITIONS_GRID,
  SPAWN_POSITIONS_LIMIT,
} from '~const/world/spawner';
import { excludePosition, getIsometricDistance, sortByMatrixDistance } from '~lib/dimension';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { IBuilding } from '~type/world/entities/building';
import { SpawnTarget, Vector2D } from '~type/world/level';
import { ISpawner, SpawnCache } from '~type/world/spawner';

export class Spawner implements ISpawner {
  private scene: IWorld;

  private positions: Vector2D[] = [];

  private positionsAnalog: Vector2D[] = [];

  private cache: SpawnCache;

  constructor(scene: IWorld) {
    this.scene = scene;

    this.positionsAnalog = [];

    this.clearCache();
    this.generatePositions();
  }

  public clearCache() {
    this.cache = {
      targetPosition: null,
      positions: [],
    };
  }

  private getCachedPositions() {
    if (
      this.cache.targetPosition
      && this.cache.positions.length > 0
      && getIsometricDistance(this.cache.targetPosition, this.scene.player.positionAtMatrix) < SPAWN_CACHE_RESET_DISTANCE
    ) {
      return this.cache.positions;
    }

    return null;
  }

  private cachePositions(positions: Vector2D[]) {
    this.cache = {
      targetPosition: this.scene.player.positionAtMatrix,
      positions,
    };
  }

  public async getSpawnPosition() {
    const positions = await this.getSpawnPositions();

    return this.selectRandomPosition(positions);
  }

  private async getSpawnPositions() {
    const cachedPositions = this.getCachedPositions();

    if (cachedPositions) {
      return cachedPositions;
    }

    const freePositions = this.getFreePositions();

    if (freePositions.length === 0) {
      return this.getAnalogPositions();
    }

    // TODO: Exclude potentially unnecessary positions
    const pathsResolves = await this.getPathsResolvesToPositions(freePositions);

    if (pathsResolves.length === 0) {
      return this.getAnalogPositions();
    }

    const sortedPositions = pathsResolves
      .sort((a, b) => (a.cost - b.cost))
      .map(({ position }) => position);

    this.cachePositions(sortedPositions);

    return sortedPositions;
  }

  private getAnalogPositions() {
    if (this.positionsAnalog.length === 0) {
      this.generateAnalogSpawnPositions();
    }

    return sortByMatrixDistance(this.positionsAnalog, this.scene.player.positionAtMatrix);
  }

  private getFreePositions() {
    const buildings = this.scene.getEntities<IBuilding>(EntityType.BUILDING);

    return this.positions.filter((position) => (
      Phaser.Math.Distance.BetweenPoints(position, this.scene.player.positionAtMatrix) >= SPAWN_DISTANCE_FROM_PLAYER
      && buildings.every((building) => (
        Phaser.Math.Distance.BetweenPoints(position, building.positionAtMatrix) >= SPAWN_DISTANCE_FROM_BUILDING
      ))
    ));
  }

  private selectRandomPosition(positions: Vector2D[]) {
    const positionsLimit = Math.min(SPAWN_POSITIONS_LIMIT, 4 + this.scene.wave.number);
    const positionAtMatrix = Phaser.Utils.Array.GetRandom(
      positions.slice(0, positionsLimit),
    );

    return positionAtMatrix;
  }

  private getPathsResolvesToPositions(positions: Vector2D[]) {
    type PathResolve = {
      cost: number
      position: Vector2D
    };

    return new Promise<PathResolve[]>((resolve) => {
      let completed = 0;
      const result: PathResolve[] = [];

      positions.forEach((position) => {
        this.scene.level.navigator.createTask({
          from: position,
          to: this.scene.player.positionAtMatrix,
          grid: this.scene.level.gridCollide,
        }, (path, cost) => {
          if (path) {
            result.push({ cost, position });
          } else {
            excludePosition(this.positions, position);
          }

          completed++;
          if (completed === positions.length) {
            resolve(result);
          }
        });
      });
    });
  }

  private generatePositions() {
    this.positions = this.scene.level.readSpawnPositions(
      SpawnTarget.ENEMY,
      SPAWN_POSITIONS_GRID,
    );
  }

  private generateAnalogSpawnPositions() {
    this.positionsAnalog = [];
    for (let x = 0; x < this.scene.level.map.width; x++) {
      for (let y = 0; y < this.scene.level.map.height; y++) {
        if (
          x === 0
          || x === this.scene.level.map.width - 1
          || y === 0
          || y === this.scene.level.map.height - 1
        ) {
          this.positionsAnalog.push({ x, y });
        }
      }
    }
  }
}

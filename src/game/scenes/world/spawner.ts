import {
  SPAWN_CACHE_RESET_DISTANCE,
  SPAWN_DISTANCE_FROM_BUILDING,
  SPAWN_DISTANCE_FROM_PLAYER,
  SPAWN_POSITIONS_GRID,
  SPAWN_POSITIONS_INPUT_LIMIT,
  SPAWN_POSITIONS_OUTPUT_LIMIT,
  SPAWN_COST_FACTOR,
} from '~const/world/spawner';
import { excludePosition, getIsometricDistance, sortByMatrixDistance } from '~lib/dimension';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { IBuilding } from '~type/world/entities/building';
import { SpawnTarget, Vector2D } from '~type/world/level';
import {
  ISpawner, SpawnCache, SpawnPositionResolve, SpawnPositionMeta,
} from '~type/world/spawner';

export class Spawner implements ISpawner {
  private scene: IWorld;

  private positions: Vector2D[] = [];

  private positionsAnalog: Vector2D[] = [];

  private cache: SpawnCache;

  private tasks: string[] = [];

  constructor(scene: IWorld) {
    this.scene = scene;
    this.positionsAnalog = [];
    this.tasks = [];

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

    return Phaser.Utils.Array.GetRandom(positions);
  }

  private async getSpawnPositions() {
    const cachedPositions = this.getCachedPositions();

    if (cachedPositions) {
      return cachedPositions;
    }

    const positionsMeta = this.getFreePositionsMeta();
    const limit = this.getPositionsLimit();

    if (positionsMeta.length === 0) {
      return this.getAnalogPositions()
        .slice(0, limit);
    }

    const positions = await this.getPositionsWithOptimalCost(positionsMeta, limit);

    if (positions.length === 0) {
      return this.getAnalogPositions()
        .slice(0, limit);
    }

    this.cachePositions(positions);

    return positions;
  }

  private getAnalogPositions() {
    if (this.positionsAnalog.length === 0) {
      this.generateAnalogSpawnPositions();
    }

    return sortByMatrixDistance(this.positionsAnalog, this.scene.player.positionAtMatrix);
  }

  private getFreePositionsMeta() {
    const buildings = this.scene.getEntities<IBuilding>(EntityType.BUILDING);
    const positions = this.positions.filter((position) => (
      Phaser.Math.Distance.BetweenPoints(position, this.scene.player.positionAtMatrix) >= SPAWN_DISTANCE_FROM_PLAYER
      && buildings.every((building) => (
        Phaser.Math.Distance.BetweenPoints(position, building.positionAtMatrix) >= SPAWN_DISTANCE_FROM_BUILDING
      ))
    ));

    return positions.map((position) => ({
      position,
      distance: Phaser.Math.Distance.BetweenPoints(position, this.scene.player.positionAtMatrix),
    }))
      .sort((a, b) => (a.distance - b.distance))
      .slice(0, SPAWN_POSITIONS_INPUT_LIMIT);
  }

  private getPositionsLimit() {
    return Math.min(SPAWN_POSITIONS_OUTPUT_LIMIT, 3 + this.scene.wave.number);
  }

  private async getPositionsWithOptimalCost(meta: SpawnPositionMeta[], limit: number) {
    let positions = await new Promise<SpawnPositionResolve[]>((resolve) => {
      let allowables = 0;
      const result: SpawnPositionResolve[] = [];

      meta.forEach((data) => {
        const task = this.scene.level.navigator.createTask({
          from: data.position,
          to: this.scene.player.positionAtMatrix,
          grid: this.scene.level.gridCollide,
        }, (path, cost) => {
          this.completeTask(task);

          if (path) {
            result.push({
              position: data.position,
              cost,
            });

            if ((cost / data.distance) <= SPAWN_COST_FACTOR) {
              allowables++;
              if (allowables === limit) {
                this.cancelTasks();
              }
            }
          } else {
            excludePosition(this.positions, data.position);
          }

          if (this.tasks.length === 0) {
            resolve(result);
          }
        });

        this.tasks.push(task);
      });
    });

    if (positions.length > limit) {
      positions = positions
        .sort((a, b) => (a.cost - b.cost))
        .slice(0, limit);
    }

    return positions.map((data) => data.position);
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

  private completeTask(task: string) {
    const index = this.tasks.indexOf(task);

    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  private cancelTasks() {
    this.tasks.forEach((task) => {
      this.scene.level.navigator.cancelTask(task);
    });
    this.tasks = [];
  }
}

import type { WorldScene } from '..';
import type { Building } from '../entities/building';
import { EntityType } from '../entities/types';
import { SpawnTarget } from '../level/types';
import type { PositionAtMatrix } from '../level/types';

import {
  SPAWN_CACHE_RESET_DISTANCE,
  SPAWN_DISTANCE_FROM_BUILDING,
  SPAWN_DISTANCE_FROM_PLAYER,
  SPAWN_POSITIONS_GRID,
  SPAWN_POSITIONS_INPUT_LIMIT,
  SPAWN_POSITIONS_OUTPUT_LIMIT,
  SPAWN_COST_FACTOR,
} from './const';
import type { SpawnCache, SpawnPositionMeta, SpawnPositionResolve } from './types';

import { excludePosition, getIsometricDistance, sortByMatrixDistance } from '~core/dimension';

export class Spawner {
  private scene: WorldScene;

  private positions: PositionAtMatrix[] = [];

  private positionsAnalog: PositionAtMatrix[] = [];

  private cache: SpawnCache;

  private tasks: string[] = [];

  constructor(scene: WorldScene) {
    this.scene = scene;
    this.positionsAnalog = [];
    this.tasks = [];

    this.clearCache();
    this.generatePositions();
  }

  public clearCache() {
    this.cache = {
      target: null,
      positions: [],
    };
  }

  private getCachedPositions() {
    if (
      this.cache.target
      && this.cache.positions.length > 0
      && getIsometricDistance(this.cache.target, this.scene.player.lastVisiblePosition) < SPAWN_CACHE_RESET_DISTANCE
    ) {
      return this.cache.positions;
    }

    return null;
  }

  private cachePositions(positions: PositionAtMatrix[]) {
    this.cache = {
      target: this.scene.player.lastVisiblePosition,
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

    return sortByMatrixDistance(this.positionsAnalog, this.scene.player.lastVisiblePosition);
  }

  private getFreePositionsMeta() {
    const buildings = this.scene.getEntities<Building>(EntityType.BUILDING);
    const distanceFromPlayer = this.getSpawnDistanceFromPlayer();
    const positions = this.positions
      .map((position) => ({
        position,
        distance: Phaser.Math.Distance.BetweenPoints(position, this.scene.player.lastVisiblePosition),
      }))
      .filter(({ position, distance }) => (
        distance >= distanceFromPlayer
        && buildings.every((building) => (
          Phaser.Math.Distance.BetweenPoints(position, building.positionAtMatrix) >= SPAWN_DISTANCE_FROM_BUILDING
        ))
      ));

    return positions
      .sort((a, b) => (a.distance - b.distance))
      .slice(0, SPAWN_POSITIONS_INPUT_LIMIT);
  }

  private getPositionsLimit() {
    const rate = this.scene.wave.number - 1;

    return Math.min(SPAWN_POSITIONS_OUTPUT_LIMIT[0] + rate, SPAWN_POSITIONS_OUTPUT_LIMIT[1]);
  }

  private getSpawnDistanceFromPlayer() {
    const rate = (this.scene.wave.number - 1) * 2;

    return Math.min(SPAWN_DISTANCE_FROM_PLAYER[0] + rate, SPAWN_DISTANCE_FROM_PLAYER[1]);
  }

  private async getPositionsWithOptimalCost(meta: SpawnPositionMeta[], limit: number) {
    let positions = await new Promise<SpawnPositionResolve[]>((resolve) => {
      let allowables = 0;
      const result: SpawnPositionResolve[] = [];

      meta.forEach((data) => {
        const task = this.scene.level.navigator.createTask({
          from: data.position,
          to: this.scene.player.lastVisiblePosition,
          grid: this.scene.level.gridCollide,
          ignoreCosts: true,
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

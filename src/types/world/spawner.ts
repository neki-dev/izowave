import { Vector2D } from './level';

export interface ISpawner {
  /**
   * Clear cached positions.
   */
  clearCache(): void

  /**
   * Get position for enemy spawn.
   */
  getSpawnPosition(): Promise<Vector2D>
}

export type SpawnCache = {
  targetPosition: Nullable<Vector2D>
  positions: Vector2D[]
};

export type SpawnPositionMeta = {
  distance: number
  position: Vector2D
};

export type SpawnPositionResolve = {
  cost: number
  position: Vector2D
};

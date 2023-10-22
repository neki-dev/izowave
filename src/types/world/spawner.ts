import { PositionAtMatrix } from './level';

export interface ISpawner {
  /**
   * Clear cached positions.
   */
  clearCache(): void

  /**
   * Get position for enemy spawn.
   */
  getSpawnPosition(): Promise<PositionAtMatrix>
}

export type SpawnCache = {
  target: Nullable<PositionAtMatrix>
  positions: PositionAtMatrix[]
};

export type SpawnPositionMeta = {
  distance: number
  position: PositionAtMatrix
};

export type SpawnPositionResolve = {
  cost: number
  position: PositionAtMatrix
};

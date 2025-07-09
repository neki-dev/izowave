import type { PositionAtMatrix } from '../level/types';

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

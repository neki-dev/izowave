import { ITile } from '~type/world/level/tile-matrix';

const tile = {
  on: jest.fn(),
  once: jest.fn(),
} as unknown as ITile;

export default tile;

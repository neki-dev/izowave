import type { ITile } from '../tile-matrix/types';

const tile = {
  on: jest.fn(),
  once: jest.fn(),
} as unknown as ITile;

export default tile;

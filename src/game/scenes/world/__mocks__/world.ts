import { IWorld } from '~type/world';

const world = {
  getTime: jest.fn(),
  isTimePaused: jest.fn(() => false),
  setTimePause: jest.fn(),
  spawnEnemy: jest.fn(),
  game: {
    difficulty: 1,
    tutorial: {
      isDisabled: true,
      beg: jest.fn(),
      end: jest.fn(),
    },
    analytics: {
      track: jest.fn(),
    },
  },
  entityGroups: {
    enemies: {
      getTotalUsed: jest.fn(),
    },
  },
  player: {},
  input: {
    keyboard: {
      on: jest.fn(),
    },
  },
  sound: {
    play: jest.fn(),
  },
} as unknown as IWorld;

export default world;

import { World } from '../world';

const world = {
  getTimerNow: jest.fn(),
  isTimerPaused: jest.fn(() => false),
  spawnEnemy: jest.fn(),
  game: {
    difficulty: 1,
    tutorial: {
      // step: TutorialStep.NONE,
      on: jest.fn(),
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
} as unknown as World;

export default world;

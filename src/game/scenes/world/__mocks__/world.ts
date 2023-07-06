import { TutorialStepState } from '~type/tutorial';

const world = {
  getTime: jest.fn(() => 0),
  isTimePaused: jest.fn(() => false),
  setTimePause: jest.fn(),
  spawnEnemy: jest.fn(),
  game: {
    difficulty: 1,
    tutorial: {
      isDisabled: true,
      start: jest.fn(),
      pause: jest.fn(),
      complete: jest.fn(),
      state: jest.fn(() => TutorialStepState.COMPLETED),
    },
    analytics: {
      track: jest.fn(),
    },
    screen: {
      notice: jest.fn(),
    },
    getDifficultyMultiplier: jest.fn(() => 1.0),
  },
  entityGroups: {
    enemies: {
      getTotalUsed: jest.fn(() => 0),
    },
  },
  level: {
    looseEffects: jest.fn(),
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
};

export default world;

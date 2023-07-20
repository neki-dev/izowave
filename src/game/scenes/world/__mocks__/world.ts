import { TutorialStepState } from '~type/tutorial';

const entityGroup = {
  getTotalUsed: jest.fn(() => 0),
};

const world = {
  getTime: jest.fn(() => 0),
  isTimePaused: jest.fn(() => false),
  setTimePause: jest.fn(),
  spawnEnemy: jest.fn(),
  game: {
    difficulty: 1,
    tutorial: {
      isEnabled: false,
      enable: jest.fn(),
      disable: jest.fn(),
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
    enemy: entityGroup,
  },
  getEntities: jest.fn(() => 0),
  getEntitiesGroup: jest.fn(() => entityGroup),
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

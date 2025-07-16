import { TutorialStepState } from '~core/tutorial/types';

const entityGroup = {
  getTotalUsed: jest.fn(() => 0),
};

const world = {
  getTime: jest.fn(() => 0),
  isModeActive: jest.fn(() => false),
  isTimePaused: jest.fn(() => false),
  setTimePause: jest.fn(),
  setTimeScale: jest.fn(),
  spawnEnemy: jest.fn(),
  getResourceExtractionSpeed: jest.fn(() => 1),
  spawner: {
    getSpawnPosition: jest.fn(() => Promise.resolve({ x: 0, y: 0 })),
  },
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
  player: {
    giveResources: jest.fn(),
  },
  input: {
    keyboard: {
      on: jest.fn(),
      off: jest.fn(),
    },
  },
  events: {
    on: jest.fn(),
    off: jest.fn(),
  },
  fx: {
    playSound: jest.fn(),
  },
};

export default world;

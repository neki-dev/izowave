import { TutorialStep } from '~type/tutorial';

import { World } from '../world';

const world = {
  difficulty: 1,
  getTimerNow: jest.fn(),
  spawnEnemy: jest.fn(),
  game: {
    tutorial: {
      step: TutorialStep.IDLE,
      on: jest.fn(),
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

import { TutorialStep } from '~type/tutorial';

import { World } from '../world';

const world = {
  difficulty: 1,
  getTimerNow: jest.fn(),
  spawnEnemy: jest.fn(),
  tutorial: {
    step: TutorialStep.DONE,
    on: jest.fn(),
  },
  enemies: {
    getTotalUsed: jest.fn(),
  },
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

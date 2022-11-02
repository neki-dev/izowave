import { Tutorial } from '~lib/tutorial';

export enum TutorialStep {
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  WAVE_TIMELEFT = 'WAVE_TIMELEFT',
  DONE = 'DONE',
}

export enum TutorialEvent {
  PROGRESS = 'progress',
}

declare global {
  namespace Phaser {
    interface Game {
      tutorial: Tutorial
    }
  }
}

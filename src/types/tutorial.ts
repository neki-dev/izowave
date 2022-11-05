import { Tutorial } from '~lib/tutorial';

export enum TutorialStep {
  BUILD_TOWER_FIRE = 0,
  BUILD_GENERATOR = 1,
  WAVE_TIMELEFT = 2,
  UPGRADE_BUILDING = 3,
  BUILD_AMMUNITION = 4,
  IDLE = 999,
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

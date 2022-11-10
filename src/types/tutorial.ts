export enum TutorialStep {
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  WAVE_TIMELEFT = 'WAVE_TIMELEFT',
  UPGRADE_BUILDING = 'UPGRADE_BUILDING',
  BUILD_AMMUNITION = 'BUILD_AMMUNITION',
  RELOAD_BUILDING = 'RELOAD_BUILDING',
  IDLE = 998,
  NONE = 999,
}

export enum TutorialStepState {
  IDLE = 'IDLE',
  BEG = 'BEG',
  END = 'END',
}

export enum TutorialEvent {
  BEG = 'beg',
  END = 'end',
}

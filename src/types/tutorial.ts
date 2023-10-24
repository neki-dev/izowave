export type TutorialBindCallbacks = {
  beg?: () => void
  end?: () => void
};

export type TutorialBindAllCallbacks = {
  beg?: (step: TutorialStep) => void
  end?: (step: TutorialStep) => void
};

export enum TutorialStep {
  SKIP_TIMELEFT = 'SKIP_TIMELEFT',
  STOP_BUILD = 'STOP_BUILD',
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_AMMUNITION = 'BUILD_AMMUNITION',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  BUILD_GENERATOR_SECOND = 'BUILD_GENERATOR_SECOND',
  BUILD_RADAR = 'BUILD_RADAR',
  BUY_AMMO = 'BUY_AMMO',
  UPGRADE_BUILDING = 'UPGRADE_BUILDING',
  RELOAD_TOWER = 'RELOAD_TOWER',
  UPGRADE_SKILL = 'UPGRADE_SKILL',
  RESOURCES = 'RESOURCES',
}

export enum TutorialStepState {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export enum TutorialEvents {
  BEG = 'beg',
  END = 'end',
}

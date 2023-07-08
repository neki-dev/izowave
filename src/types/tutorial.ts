import EventEmitter from 'events';

export interface ITutorial extends EventEmitter {
  /**
   * State of disable.
   */
  readonly isDisabled: boolean

  /**
   * Disable tutorial.
   */
  disable(): void

  /**
   * Start tutorial step.
   * @param step - Step
   */
  start(step: TutorialStep): void

  /**
   * Pause tutorial step.
   * @param step - Step
   */
  pause(step: TutorialStep): void

  /**
   * Complete tutorial step.
   * @param step - Step
   */
  complete(step: TutorialStep): void

  /**
   * Check step state.
   * @param step - Step
   */
  state(step: TutorialStep): TutorialStepState

  /**
   * Bind callbacks on tutorial step progress.
   * @param step - Step to bind
   * @param callback - Callbacks functions
   */
  bind(step: TutorialStep, callbacks: TutorialBindCallbacks): () => void

  /**
   * Bind callbacks on tutorial any progress.
   * @param callback - Callbacks functions
   */
  bindAll(callbacks: TutorialBindAllCallbacks): () => void
}

export type TutorialBindCallbacks = {
  beg?: () => void
  end?: () => void
};

export type TutorialBindAllCallbacks = {
  beg?: (step: TutorialStep) => void
  end?: (step: TutorialStep) => void
};

export enum TutorialStep {
  WAVE_TIMELEFT = 'WAVE_TIMELEFT',
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_AMMUNITION = 'BUILD_AMMUNITION',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  UPGRADE_BUILDING = 'UPGRADE_BUILDING',
  RELOAD_BUILDING = 'RELOAD_BUILDING',
  UPGRADE_PLAYER = 'UPGRADE_PLAYER',
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

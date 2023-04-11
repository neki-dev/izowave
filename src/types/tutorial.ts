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
   * Begin step.
   * @param step - Step
   */
  beg(step: TutorialStep): void

  /**
   * End step.
   * @param step - Step
   */
  end(step: TutorialStep): void

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
  WAVE_SEASON = 'WAVE_SEASON',
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_AMMUNITION = 'BUILD_AMMUNITION',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  UPGRADE_BUILDING = 'UPGRADE_BUILDING',
  RELOAD_BUILDING = 'RELOAD_BUILDING',
}

export enum TutorialStepState {
  IDLE = 'IDLE',
  BEG = 'BEG',
  END = 'END',
}

export enum TutorialEvents {
  BEG = 'beg',
  END = 'end',
}

import EventEmitter from 'events';

export interface ITutorial extends EventEmitter {
  /**
   * State of enable.
   */
  readonly isEnabled: boolean

  /**
   * Steps states.
   */
  progress: Partial<Record<TutorialStep, TutorialStepState>>

  /**
   * Remove all listeners and reset states.
   */
  reset(): void

  /**
   * Enable tutorial.
   */
  enable(): void

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
  STOP_BUILD = 'STOP_BUILD',
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_AMMUNITION = 'BUILD_AMMUNITION',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  BUILD_RADAR = 'BUILD_RADAR',
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

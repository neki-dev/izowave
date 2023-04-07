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
   * Bind callback on begin step.
   * @param step - Step to bind
   * @param callback - Callback function
   */
  onBeg(step: TutorialStep, callback: () => void): void

  /**
   * Unbind callback from begin step.
   * @param step - Step to unbind
   * @param callback - Callback function
   */
  offBeg(step: TutorialStep, callback: () => void): void

  /**
   * Bind callback on begin steps.
   * @param callback - Callback function
   */
  onBegAny(callback: (step: TutorialStep) => void): void

  /**
   * Unbind callback from begin steps.
   *
   * @param callback - Callback function
   */
  offBegAny(callback: (step: TutorialStep) => void): void

  /**
   * Bind callback on end step.
   * @param step - Step to bind
   * @param callback - Callback function
   */
  onEnd(step: TutorialStep, callback: () => void): void

  /**
   * Unbind callback from end step.
   * @param step - Step to unbind
   * @param callback - Callback function
   */
  offEnd(step: TutorialStep, callback: () => void): void

  /**
   * Bind callback on end steps.
   * @param callback - Callback function
   */
  onEndAny(callback: (step: TutorialStep) => void): void

  /**
   * Unbind callback from end steps.
   * @param callback - Callback function
   */
  offEndAny(callback: (step: TutorialStep) => void): void
}

export enum TutorialStep {
  BUILD_TOWER_FIRE = 'BUILD_TOWER_FIRE',
  BUILD_GENERATOR = 'BUILD_GENERATOR',
  WAVE_TIMELEFT = 'WAVE_TIMELEFT',
  UPGRADE_BUILDING = 'UPGRADE_BUILDING',
  BUILD_AMMUNITION = 'BUILD_AMMUNITION',
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

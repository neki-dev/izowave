import EventEmitter from 'events';

import { TutorialEvents, TutorialStep, TutorialStepState } from '~type/tutorial';

export class Tutorial extends EventEmitter {
  /**
   * Steps progress states.
   */
  private progress: Partial<Record<TutorialStep, boolean>> = {};

  /**
   * Disabled state.
   */
  private _isDisabled: boolean = false;

  public get isDisabled() {
    return this._isDisabled;
  }

  private set isDisabled(v) {
    this._isDisabled = v;
  }

  /**
   * Tutorial constructor.
   */
  constructor() {
    super();

    if (IS_DEV_MODE) {
      // this.disable();
    }
  }

  /**
   * Begin step.
   *
   * @param step - Step
   */
  public beg(step: TutorialStep) {
    if (this.isDisabled || this.progress[step] !== undefined) {
      return;
    }

    this.progress[step] = true;

    this.emit(TutorialEvents.BEG, step);
    this.emit(`${TutorialEvents.BEG}_${step}`);
  }

  /**
   * End step.
   *
   * @param step - Step
   */
  public end(step: TutorialStep) {
    if (this.isDisabled || this.progress[step] !== true) {
      return;
    }

    this.progress[step] = false;

    this.emit(TutorialEvents.END, step);
    this.emit(`${TutorialEvents.END}_${step}`);
  }

  /**
   * Check step state.
   *
   * @param step - Step
   */
  public state(step: TutorialStep) {
    if (this.isDisabled) {
      return TutorialStepState.END;
    }

    if (this.progress[step] === undefined) {
      return TutorialStepState.IDLE;
    }

    return this.progress[step] ? TutorialStepState.BEG : TutorialStepState.END;
  }

  /**
   * Bind callback on begin step.
   *
   * @param step - Step to bind
   * @param callback - Callback function
   */
  public onBeg(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.once(`${TutorialEvents.BEG}_${step}`, callback);
  }

  /**
   * Unbind callback on begin step.
   *
   * @param step - Step to unbind
   * @param callback - Callback function
   */
  public offBeg(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.off(`${TutorialEvents.BEG}_${step}`, callback);
  }

  /**
   * Bind callback on begin steps.
   *
   * @param callback - Callback function
   */
  public onBegAny(callback: (step: TutorialStep) => void) {
    if (this.isDisabled) {
      return;
    }

    this.on(TutorialEvents.BEG, callback);
  }

  /**
   * Unbind callback on begin steps.
   *
   * @param callback - Callback function
   */
  public offBegAny(callback: (step: TutorialStep) => void) {
    this.off(TutorialEvents.BEG, callback);
  }

  /**
   * Bind callback on end step.
   *
   * @param step - Step to bind
   * @param callback - Callback function
   */
  public onEnd(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.once(`${TutorialEvents.END}_${step}`, callback);
  }

  /**
   * Unbind callback on end step.
   *
   * @param step - Step to unbind
   * @param callback - Callback function
   */
  public offEnd(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.off(`${TutorialEvents.END}_${step}`, callback);
  }

  /**
   * Bind callback on end steps.
   *
   * @param callback - Callback function
   */
  public onEndAny(callback: (step: TutorialStep) => void) {
    if (this.isDisabled) {
      return;
    }

    this.on(TutorialEvents.END, callback);
  }

  /**
   * Unbind callback on end steps.
   *
   * @param callback - Callback function
   */
  public offEndAny(callback: (step: TutorialStep) => void) {
    this.off(TutorialEvents.END, callback);
  }

  /**
   * Disable tutorial.
   */
  public disable() {
    this.isDisabled = true;
  }
}

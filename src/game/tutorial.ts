import EventEmitter from 'events';

import { TutorialEvent, TutorialStep } from '~type/tutorial';

export class Tutorial extends EventEmitter {
  /**
   * Current step.
   */
  private _step: TutorialStep = TutorialStep.IDLE;

  public get step() { return this._step; }

  private set step(v) { this._step = v; }

  /**
   * Disabled state.
   */
  private _isDisabled: boolean = false;

  public get isDisabled() { return this._isDisabled; }

  private set isDisabled(v) { this._isDisabled = v; }

  /**
   * Tutorial constructor.
   */
  constructor() {
    super();

    if (IS_DEV_MODE) {
      this.disable();
    } else {
      this.progress(TutorialStep.BUILD_TOWER_FIRE);
    }
  }

  /**
   * Change tutorial step.
   *
   * @param step - Next step
   */
  public progress(step: TutorialStep) {
    if (this.isDisabled) {
      return;
    }

    this.step = step;

    this.emit(TutorialEvent.PROGRESS, step);
  }

  /**
   * Disable tutorial.
   */
  public disable() {
    this.isDisabled = true;
    this.step = TutorialStep.NONE;
  }
}

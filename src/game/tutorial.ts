import EventEmitter from 'events';

import {
  ITutorial, TutorialEvents, TutorialStep, TutorialStepState,
} from '~type/tutorial';

export class Tutorial extends EventEmitter implements ITutorial {
  private progress: Partial<Record<TutorialStep, boolean>> = {};

  private _isDisabled: boolean = false;

  public get isDisabled() { return this._isDisabled; }

  private set isDisabled(v) { this._isDisabled = v; }

  constructor() {
    super();

    if (IS_DEV_MODE) {
      this.disable();
    }
  }

  public beg(step: TutorialStep) {
    if (this.isDisabled || this.progress[step] !== undefined) {
      return;
    }

    this.progress[step] = true;

    this.emit(TutorialEvents.BEG, step);
    this.emit(`${TutorialEvents.BEG}_${step}`);
  }

  public end(step: TutorialStep) {
    if (this.isDisabled || this.progress[step] !== true) {
      return;
    }

    this.progress[step] = false;

    this.emit(TutorialEvents.END, step);
    this.emit(`${TutorialEvents.END}_${step}`);
  }

  public state(step: TutorialStep) {
    if (this.isDisabled) {
      return TutorialStepState.END;
    }

    if (this.progress[step] === undefined) {
      return TutorialStepState.IDLE;
    }

    return this.progress[step] ? TutorialStepState.BEG : TutorialStepState.END;
  }

  public onBeg(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.once(`${TutorialEvents.BEG}_${step}`, callback);
  }

  public offBeg(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.off(`${TutorialEvents.BEG}_${step}`, callback);
  }

  public onBegAny(callback: (step: TutorialStep) => void) {
    if (this.isDisabled) {
      return;
    }

    this.on(TutorialEvents.BEG, callback);
  }

  public offBegAny(callback: (step: TutorialStep) => void) {
    this.off(TutorialEvents.BEG, callback);
  }

  public onEnd(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.once(`${TutorialEvents.END}_${step}`, callback);
  }

  public offEnd(step: TutorialStep, callback: () => void) {
    if (this.isDisabled) {
      return;
    }

    this.off(`${TutorialEvents.END}_${step}`, callback);
  }

  public onEndAny(callback: (step: TutorialStep) => void) {
    if (this.isDisabled) {
      return;
    }

    this.on(TutorialEvents.END, callback);
  }

  public offEndAny(callback: (step: TutorialStep) => void) {
    this.off(TutorialEvents.END, callback);
  }

  public disable() {
    this.isDisabled = true;
  }
}

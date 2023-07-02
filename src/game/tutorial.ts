import EventEmitter from 'events';

import {
  ITutorial, TutorialEvents, TutorialStepState, TutorialStep,
  TutorialBindCallbacks, TutorialBindAllCallbacks,
} from '~type/tutorial';

export class Tutorial extends EventEmitter implements ITutorial {
  private progress: Partial<Record<TutorialStep, boolean>> = {};

  private _isDisabled: boolean = false;

  public get isDisabled() { return this._isDisabled; }

  private set isDisabled(v) { this._isDisabled = v; }

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

  public bind(step: TutorialStep, callbacks: TutorialBindCallbacks) {
    if (this.isDisabled) {
      return () => {};
    }

    if (callbacks.beg) {
      this.once(`${TutorialEvents.BEG}_${step}`, callbacks.beg);
    }
    if (callbacks.end) {
      this.once(`${TutorialEvents.END}_${step}`, callbacks.end);
    }

    return () => {
      if (callbacks.beg) {
        this.off(`${TutorialEvents.BEG}_${step}`, callbacks.beg);
      }
      if (callbacks.end) {
        this.off(`${TutorialEvents.END}_${step}`, callbacks.end);
      }
    };
  }

  public bindAll(callbacks: TutorialBindAllCallbacks) {
    if (this.isDisabled) {
      return () => {};
    }

    if (callbacks.beg) {
      this.on(TutorialEvents.BEG, callbacks.beg);
    }
    if (callbacks.end) {
      this.on(TutorialEvents.END, callbacks.end);
    }

    return () => {
      if (callbacks.beg) {
        this.off(TutorialEvents.BEG, callbacks.beg);
      }
      if (callbacks.end) {
        this.off(TutorialEvents.END, callbacks.end);
      }
    };
  }

  public disable() {
    this.isDisabled = true;
  }
}

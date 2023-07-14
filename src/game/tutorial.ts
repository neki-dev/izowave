import EventEmitter from 'events';

import {
  ITutorial, TutorialEvents, TutorialStepState, TutorialStep,
  TutorialBindCallbacks, TutorialBindAllCallbacks,
} from '~type/tutorial';

export class Tutorial extends EventEmitter implements ITutorial {
  private progress: Partial<Record<TutorialStep, TutorialStepState>> = {};

  private _isDisabled: boolean = false;

  public get isDisabled() { return this._isDisabled; }

  private set isDisabled(v) { this._isDisabled = v; }

  public start(step: TutorialStep) {
    if (
      this.isDisabled
      || this.progress[step] === TutorialStepState.IN_PROGRESS
      || this.progress[step] === TutorialStepState.COMPLETED
    ) {
      return;
    }

    this.progress[step] = TutorialStepState.IN_PROGRESS;

    this.emit(TutorialEvents.BEG, step);
    this.emit(`${TutorialEvents.BEG}_${step}`);
  }

  public pause(step: TutorialStep) {
    if (
      this.isDisabled
      || this.progress[step] !== TutorialStepState.IN_PROGRESS
    ) {
      return;
    }

    this.progress[step] = TutorialStepState.PAUSED;

    this.emit(TutorialEvents.END, step);
    this.emit(`${TutorialEvents.END}_${step}`);
  }

  public complete(step: TutorialStep) {
    if (
      this.isDisabled
      || this.progress[step] === TutorialStepState.COMPLETED
    ) {
      return;
    }

    this.progress[step] = TutorialStepState.COMPLETED;

    this.emit(TutorialEvents.END, step);
    this.emit(`${TutorialEvents.END}_${step}`);
  }

  public state(step: TutorialStep) {
    if (this.isDisabled) {
      return TutorialStepState.COMPLETED;
    }

    return this.progress[step] ?? TutorialStepState.IDLE;
  }

  public bind(step: TutorialStep, callbacks: TutorialBindCallbacks) {
    if (this.isDisabled) {
      return () => {};
    }

    if (callbacks.beg) {
      this.on(`${TutorialEvents.BEG}_${step}`, callbacks.beg);
    }
    if (callbacks.end) {
      this.on(`${TutorialEvents.END}_${step}`, callbacks.end);
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

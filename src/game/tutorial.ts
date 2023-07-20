import EventEmitter from 'events';

import {
  ITutorial, TutorialEvents, TutorialStepState, TutorialStep,
  TutorialBindCallbacks, TutorialBindAllCallbacks,
} from '~type/tutorial';

export class Tutorial extends EventEmitter implements ITutorial {
  private progress: Partial<Record<TutorialStep, TutorialStepState>> = {};

  private _isEnabled: boolean = true;

  public get isEnabled() { return this._isEnabled; }

  private set isEnabled(v) { this._isEnabled = v; }

  public reset() {
    this.removeAllListeners();
    this.progress = {};
  }

  public start(step: TutorialStep) {
    if (
      this.progress[step] === TutorialStepState.IN_PROGRESS
      || this.progress[step] === TutorialStepState.COMPLETED
    ) {
      return;
    }

    this.progress[step] = TutorialStepState.IN_PROGRESS;

    if (!this.isEnabled) {
      return;
    }

    this.emit(TutorialEvents.BEG, step);
    this.emit(`${TutorialEvents.BEG}_${step}`);
  }

  public pause(step: TutorialStep) {
    if (this.progress[step] !== TutorialStepState.IN_PROGRESS) {
      return;
    }

    this.progress[step] = TutorialStepState.PAUSED;

    if (!this.isEnabled) {
      return;
    }

    this.emit(TutorialEvents.END, step);
    this.emit(`${TutorialEvents.END}_${step}`);
  }

  public complete(step: TutorialStep) {
    if (this.progress[step] === TutorialStepState.COMPLETED) {
      return;
    }

    this.progress[step] = TutorialStepState.COMPLETED;

    if (!this.isEnabled) {
      return;
    }

    this.emit(TutorialEvents.END, step);
    this.emit(`${TutorialEvents.END}_${step}`);
  }

  public state(step: TutorialStep) {
    return this.progress[step] ?? TutorialStepState.IDLE;
  }

  public bind(step: TutorialStep, callbacks: TutorialBindCallbacks) {
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

  public enable() {
    this.isEnabled = true;

    const states = Object.keys(this.progress) as TutorialStep[];

    states.forEach((step) => {
      const state = this.state(step);

      if (state === TutorialStepState.IN_PROGRESS) {
        this.emit(TutorialEvents.BEG, step);
        this.emit(`${TutorialEvents.BEG}_${step}`);
      }
    });
  }

  public disable() {
    const states = Object.keys(this.progress) as TutorialStep[];

    states.forEach((step) => {
      const state = this.state(step);

      if (state === TutorialStepState.IN_PROGRESS) {
        this.emit(TutorialEvents.END, step);
        this.emit(`${TutorialEvents.END}_${step}`);
      }
    });

    this.isEnabled = false;
  }
}

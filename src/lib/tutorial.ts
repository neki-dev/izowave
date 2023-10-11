import EventEmitter from 'events';

import {
  TutorialEvents, TutorialStepState, TutorialStep,
  TutorialBindCallbacks, TutorialBindAllCallbacks,
} from '~type/tutorial';

export class Tutorial {
  public static Progress: Partial<Record<TutorialStep, TutorialStepState>> = {};

  private static _IsEnabled: boolean = true;

  public static get IsEnabled() { return this._IsEnabled; }

  private static set IsEnabled(v) { this._IsEnabled = v; }

  private static Events: EventEmitter;

  public static Register() {
    this.Events = new EventEmitter();
    this.Events.setMaxListeners(0);
  }

  public static Reset() {
    this.Events.removeAllListeners();
    this.Progress = {};
  }

  public static Start(step: TutorialStep) {
    if (
      this.Progress[step] === TutorialStepState.IN_PROGRESS
      || this.Progress[step] === TutorialStepState.COMPLETED
    ) {
      return;
    }

    this.Progress[step] = TutorialStepState.IN_PROGRESS;

    if (!this.IsEnabled) {
      return;
    }

    this.Events.emit(TutorialEvents.BEG, step);
    this.Events.emit(`${TutorialEvents.BEG}_${step}`);
  }

  public static Pause(step: TutorialStep) {
    if (this.Progress[step] !== TutorialStepState.IN_PROGRESS) {
      return;
    }

    this.Progress[step] = TutorialStepState.PAUSED;

    if (!this.IsEnabled) {
      return;
    }

    this.Events.emit(TutorialEvents.END, step);
    this.Events.emit(`${TutorialEvents.END}_${step}`);
  }

  public static Complete(step: TutorialStep) {
    if (this.Progress[step] === TutorialStepState.COMPLETED) {
      return;
    }

    this.Progress[step] = TutorialStepState.COMPLETED;

    if (!this.IsEnabled) {
      return;
    }

    this.Events.emit(TutorialEvents.END, step);
    this.Events.emit(`${TutorialEvents.END}_${step}`);
  }

  public static IsInProgress(step: TutorialStep) {
    return this.Progress[step] === TutorialStepState.IN_PROGRESS;
  }

  public static Bind(step: TutorialStep, callbacks: TutorialBindCallbacks) {
    if (callbacks.beg) {
      this.Events.on(`${TutorialEvents.BEG}_${step}`, callbacks.beg);
    }
    if (callbacks.end) {
      this.Events.on(`${TutorialEvents.END}_${step}`, callbacks.end);
    }

    return () => {
      if (callbacks.beg) {
        this.Events.off(`${TutorialEvents.BEG}_${step}`, callbacks.beg);
      }
      if (callbacks.end) {
        this.Events.off(`${TutorialEvents.END}_${step}`, callbacks.end);
      }
    };
  }

  public static BindAll(callbacks: TutorialBindAllCallbacks) {
    if (callbacks.beg) {
      this.Events.on(TutorialEvents.BEG, callbacks.beg);
    }
    if (callbacks.end) {
      this.Events.on(TutorialEvents.END, callbacks.end);
    }

    return () => {
      if (callbacks.beg) {
        this.Events.off(TutorialEvents.BEG, callbacks.beg);
      }
      if (callbacks.end) {
        this.Events.off(TutorialEvents.END, callbacks.end);
      }
    };
  }

  public static Enable() {
    this.IsEnabled = true;

    const states = Object.keys(this.Progress) as TutorialStep[];

    states.forEach((step) => {
      if (this.IsInProgress(step)) {
        this.Events.emit(TutorialEvents.BEG, step);
        this.Events.emit(`${TutorialEvents.BEG}_${step}`);
      }
    });
  }

  public static Disable() {
    const states = Object.keys(this.Progress) as TutorialStep[];

    states.forEach((step) => {
      if (this.IsInProgress(step)) {
        this.Events.emit(TutorialEvents.END, step);
        this.Events.emit(`${TutorialEvents.END}_${step}`);
      }
    });

    this.IsEnabled = false;
  }
}

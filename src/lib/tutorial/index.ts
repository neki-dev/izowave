import { TutorialEvents, TutorialStepState } from './types';
import type { TutorialStep, TutorialBindCallbacks, TutorialBindAllCallbacks } from './types';

export class Tutorial {
  private static _Progress: Partial<Record<TutorialStep, TutorialStepState>> = {};

  public static get Progress() { return this._Progress; }

  private static set Progress(v) { this._Progress = v; }

  private static _IsEnabled: boolean = true;

  public static get IsEnabled() { return this._IsEnabled; }

  private static set IsEnabled(v) { this._IsEnabled = v; }

  private static EventHistory: {
    event: TutorialEvents
    step: TutorialStep
  }[] = [];

  private static EventListeners: {
    event: TutorialEvents
    step: Nullable<TutorialStep>
    callback: (step: TutorialStep) => void
  }[] = [];

  public static Reset() {
    this.Progress = {};
    this.EventListeners = [];
    this.EventHistory = [];
  }

  public static Load(progress: Partial<Record<TutorialStep, TutorialStepState>>) {
    this.Progress = progress;
    this.EventListeners = [];
    this.EventHistory = [];

    this.RecallEmit();
  }

  public static Start(step: TutorialStep) {
    if (
      this.Progress[step] === TutorialStepState.IN_PROGRESS
      || this.Progress[step] === TutorialStepState.COMPLETED
    ) {
      return;
    }

    this.Progress[step] = TutorialStepState.IN_PROGRESS;

    this.Emit(TutorialEvents.BEG, step);
  }

  public static Pause(step: TutorialStep) {
    if (this.Progress[step] !== TutorialStepState.IN_PROGRESS) {
      return;
    }

    this.Progress[step] = TutorialStepState.PAUSED;

    this.Emit(TutorialEvents.END, step);
  }

  public static Complete(step: TutorialStep) {
    if (this.Progress[step] === TutorialStepState.COMPLETED) {
      return;
    }

    this.Progress[step] = TutorialStepState.COMPLETED;

    this.Emit(TutorialEvents.END, step);
  }

  public static IsInProgress(step: TutorialStep) {
    return this.Progress[step] === TutorialStepState.IN_PROGRESS;
  }

  public static Bind(step: TutorialStep, callbacks: TutorialBindCallbacks) {
    if (callbacks.beg) {
      this.Subscribe(TutorialEvents.BEG, step, callbacks.beg);
    }
    if (callbacks.end) {
      this.Subscribe(TutorialEvents.END, step, callbacks.end);
    }

    return () => {
      if (callbacks.beg) {
        this.Unsubscribe(TutorialEvents.BEG, step, callbacks.beg);
      }
      if (callbacks.end) {
        this.Unsubscribe(TutorialEvents.END, step, callbacks.end);
      }
    };
  }

  public static BindAll(callbacks: TutorialBindAllCallbacks) {
    if (callbacks.beg) {
      this.Subscribe(TutorialEvents.BEG, null, callbacks.beg);
    }
    if (callbacks.end) {
      this.Subscribe(TutorialEvents.END, null, callbacks.end);
    }

    return () => {
      if (callbacks.beg) {
        this.Unsubscribe(TutorialEvents.BEG, null, callbacks.beg);
      }
      if (callbacks.end) {
        this.Unsubscribe(TutorialEvents.END, null, callbacks.end);
      }
    };
  }

  public static ToggleHintsVisible(state: boolean) {
    const hints = document.querySelectorAll('[role=hint]');

    hints.forEach((hint) => {
      hint.classList.toggle('hidden', !state);
    });
  }

  public static Enable() {
    if (this.IsEnabled) {
      return;
    }

    this.IsEnabled = true;
    this.RecallEmit();
  }

  public static Disable() {
    if (!this.IsEnabled) {
      return;
    }

    this.EventHistory = [];

    const states = Object.keys(this.Progress) as TutorialStep[];

    states.forEach((step) => {
      if (this.IsInProgress(step)) {
        this.Emit(TutorialEvents.END, step);
      }
    });

    this.IsEnabled = false;
  }

  private static RecallEmit() {
    if (!this.IsEnabled) {
      return;
    }

    const states = Object.keys(this.Progress) as TutorialStep[];

    states.forEach((step) => {
      if (this.IsInProgress(step)) {
        this.Emit(TutorialEvents.BEG, step);
      }
    });
  }

  private static Emit(event: TutorialEvents, step: TutorialStep) {
    if (!this.IsEnabled) {
      return;
    }

    const isEmited = this.EventHistory.some((data) => (
      data.event === event
      && data.step === step
    ));

    if (isEmited) {
      console.warn('Tutorial event', event, 'for step', step, 'already was emited');

      return;
    }

    this.EventHistory.push({ event, step });
    this.EventListeners.forEach((data) => {
      if (data.event === event && (!data.step || data.step === step)) {
        data.callback(step);
      }
    });
  }

  private static Subscribe(
    event: TutorialEvents,
    step: Nullable<TutorialStep>,
    callback: (step: TutorialStep) => void,
  ) {
    this.EventListeners.push({ event, step, callback });
    this.EventHistory.forEach((data) => {
      if (
        data.event === event
        && (!step || data.step === step)
      ) {
        callback(data.step);
      }
    });
  }

  private static Unsubscribe(
    event: TutorialEvents,
    step: Nullable<TutorialStep>,
    callback: (step: TutorialStep) => void,
  ) {
    this.EventListeners = this.EventListeners.filter((data) => (
      data.event !== event
      && data.step !== step
      && data.callback !== callback
    ));
  }
}

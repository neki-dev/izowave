import { v4 as uuidv4 } from 'uuid';

import pkg from '../../package.json';
import { ANALYTICS_SERVER } from '~const/analytics';
import { AnalyticEventData } from '~type/analytics';

export class Analytics {
  private static UserId: string;

  private static Host: string;

  static Register() {
    const userId = localStorage.getItem('USER_ID');

    if (userId) {
      this.UserId = userId;
    } else {
      this.UserId = uuidv4();
      localStorage.setItem('USER_ID', this.UserId);
    }

    if (document.referrer) {
      this.Host = document.referrer.replace(/(https?:\/\/)?([^/?]+).*/, '$2');
    } else {
      this.Host = window.location.host;
    }
  }

  static TrackEvent(data: AnalyticEventData) {
    if (window.PLATFORM === 'development') {
      return;
    }

    this.FetchEventRequest(
      this.GetEventPayload(data),
    );
  }

  static TrackError(data: Error) {
    if (window.PLATFORM === 'development') {
      return;
    }

    this.FetchErrorRequest(
      this.GetErrorPayload(data),
    );
  }

  static TrackWarn(message: string) {
    if (window.PLATFORM === 'development') {
      console.warn(message);

      return;
    }

    this.FetchErrorRequest(
      this.GetWarnPayload(message),
    );
  }

  private static FetchEventRequest(payload: any) {
    fetch(`${ANALYTICS_SERVER}/api/create-event.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((e) => {
      console.warn('Failed analytics event tracking:', payload, e);
    });
  }

  private static FetchErrorRequest(payload: any) {
    fetch(`${ANALYTICS_SERVER}/api/create-error.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((e) => {
      console.warn('Failed analytics error tracking:', payload, e);
    });
  }

  private static GetEventPayload(data: AnalyticEventData) {
    return {
      // Game progress
      success: data.success,
      difficulty: data.world.game.difficulty,
      planet: data.world.level.planet,
      waveNumber: data.world.wave.number,
      resources: data.world.player.resources,
      // System info
      userId: this.UserId,
      host: this.Host,
      version: pkg.version,
    };
  }

  private static GetErrorPayload(data: Error) {
    return {
      // Error info
      type: 'error',
      message: data.message,
      stack: data.stack,
      // System info
      userId: this.UserId,
      version: pkg.version,
      userAgent: window.navigator.userAgent,
    };
  }

  private static GetWarnPayload(message: string) {
    return {
      // Warn info
      type: 'warn',
      message,
      // System info
      userId: this.UserId,
      version: pkg.version,
      userAgent: window.navigator.userAgent,
    };
  }
}

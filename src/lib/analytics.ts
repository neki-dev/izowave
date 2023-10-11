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
    const payload = this.GetEventPayload(data);

    if (IS_DEV_MODE) {
      console.log('Track analytic event:', payload);
    } else {
      fetch(`${ANALYTICS_SERVER}/api/create-event.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((e) => {
        console.warn('Failed analytics event tracking:', payload, e);
      });
    }
  }

  static TrackError(data: Error) {
    if (IS_DEV_MODE) {
      return;
    }

    const payload = this.GetErrorPayload(data);

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
      message: data.message,
      stack: data.stack,
      // System info
      userId: this.UserId,
      version: pkg.version,
      userAgent: window.navigator.userAgent,
    };
  }
}

import { v4 as uuidv4 } from 'uuid';

import pkg from '../../package.json';
import { ANALYTICS_SERVER } from '~const/analytics';
import { AnalyticEventData, IAnalytics } from '~type/analytics';

export class Analytics implements IAnalytics {
  private userId: string;

  private host: string;

  constructor() {
    const userId = localStorage.getItem('USER_ID');

    if (userId) {
      this.userId = userId;
    } else {
      this.userId = uuidv4();
      localStorage.setItem('USER_ID', this.userId);
    }

    if (document.referrer) {
      this.host = document.referrer.replace(/(https?:\/\/)?([^/?]+).*/, '$2');
    } else {
      this.host = window.location.host;
    }
  }

  public trackEvent(data: AnalyticEventData) {
    const payload = this.getEventPayload(data);

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

  public trackError(data: Error) {
    if (IS_DEV_MODE) {
      return;
    }

    const payload = this.getErrorPayload(data);

    fetch(`${ANALYTICS_SERVER}/api/create-error.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((e) => {
      console.warn('Failed analytics error tracking:', payload, e);
    });
  }

  private getEventPayload(data: AnalyticEventData) {
    return {
      // Game progress
      success: data.success,
      difficulty: data.world.game.difficulty,
      planet: data.world.level.planet,
      waveNumber: data.world.wave.number,
      resources: data.world.player.resources,
      // System info
      userId: this.userId,
      host: this.host,
      version: pkg.version,
    };
  }

  private getErrorPayload(data: Error) {
    return {
      // Error info
      message: data.message,
      stack: data.stack,
      // System info
      userId: this.userId,
      version: pkg.version,
      userAgent: window.navigator.userAgent,
    };
  }
}

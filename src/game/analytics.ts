import { v4 as uuidv4 } from 'uuid';

import pkg from '../../package.json';
import { ANALYTICS_SERVER } from '~const/analytics';
import { AnalyticData, IAnalytics } from '~type/analytics';
import { GameSettings } from '~type/game';

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

  public track(data: AnalyticData) {
    const payload = this.getPayload(data);

    if (IS_DEV_MODE) {
      console.log('Track analytic event:', payload);
    } else {
      fetch(`${ANALYTICS_SERVER}/api/create-event.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((e) => {
        console.warn('Failed analytics tracking:', payload, e);
      });
    }
  }

  private getPayload(data: AnalyticData) {
    return {
      // Game progress
      success: data.success,
      difficulty: data.world.game.settings[GameSettings.DIFFICULTY],
      waveNumber: data.world.wave.number,
      resources: data.world.player.resources,
      // System info
      userId: this.userId,
      host: this.host,
      version: pkg.version,
    };
  }
}

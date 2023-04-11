import { ANALYTICS_SERVER } from '~const/analytics';
import { AnalyticData, IAnalytics } from '~type/analytics';
import { GameSettings } from '~type/game';

export class Analytics implements IAnalytics {
  private userId: string;

  constructor() {
    const userId = localStorage.getItem('USER_ID');

    if (userId) {
      this.userId = userId;
    } else {
      this.userId = Analytics.GenerateUserId();
      localStorage.setItem('USER_ID', this.userId);
    }
  }

  public track(data: AnalyticData) {
    const payload = {
      userId: this.userId,
      success: data.success,
      difficulty: data.world.game.settings[GameSettings.DIFFICULTY],
      waveNumber: data.world.wave.number,
      resources: data.world.player.resources,
      level: data.world.player.level,
    };

    if (IS_DEV_MODE) {
      console.log('Track analytic event:', payload);
    } else {
      fetch(`${ANALYTICS_SERVER}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((e) => {
        console.warn('Failed analytics tracking:', payload, e);
      });
    }
  }

  static GenerateUserId() {
    return String.fromCharCode(97 + Math.round(Math.random() * 10)) + Date.now();
  }
}

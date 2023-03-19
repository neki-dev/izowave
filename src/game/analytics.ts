import { ANALYTICS_SERVER } from '~const/analytics';
import { AnalyticData } from '~type/analytics';

export class Analytics {
  /**
   * User unique id.
   */
  private userId: string;

  /**
   * Analytics constructor.
   */
  constructor() {
    this.userId = localStorage.getItem('USER_ID');

    if (!this.userId) {
      this.userId = Analytics.GenerateUserId();
      localStorage.setItem('USER_ID', this.userId);
    }
  }

  /**
   * Track progression event.
   *
   * @param data - Event data
   */
  public track(data: AnalyticData) {
    const payload = {
      userId: this.userId,
      success: data.success,
      difficulty: data.world.game.difficultyType,
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

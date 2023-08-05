import { IWorld } from '~type/world';

export interface IAnalytics {
  /**
   * Track progression event.
   * @param data - Event data
   */
  trackEvent(data: AnalyticEventData): void

  /**
   * Track game error.
   * @param data - Error data
   */
  trackError(data: Error): void
}

export type AnalyticEventData = {
  world: IWorld
  success: boolean
};

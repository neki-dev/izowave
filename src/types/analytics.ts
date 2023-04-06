import { IWorld } from '~type/world';

export interface IAnalytics {
  /**
   * Track progression event.
   * @param data - Event data
   */
  track(data: AnalyticData): void
}

export type AnalyticData = {
  world: IWorld
  success: boolean
};

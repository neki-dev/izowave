import { World } from '~scene/world';

declare global {
  interface Window {
    dataLayer: any[]
  }
}

export type AnalyticData = {
  world: World
  success: boolean
};

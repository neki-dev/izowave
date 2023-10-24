export enum SDKAdsType {
  MIDGAME = 'midgame',
  REWARDED = 'rewarded',
}

export type SDKAdsCallbacks = {
  onStart?: () => void
  onFinish?: () => void
  onReward?: () => void
};

declare global {
  interface Window {
    PokiSDK?: any
    CrazyGames?: any
  }
}

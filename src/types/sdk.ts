export enum SDKAdsType {
  MIDGAME = 'midgame',
  REWARDED = 'rewarded',
}

declare global {
  interface Window {
    PokiSDK?: any
    CrazyGames?: any
  }
}

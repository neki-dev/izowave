export enum SDKPlatform {
  CRAZY_GAMES = 'CRAZY_GAMES',
  POKI = 'POKI',
}

export enum SDKAdvType {
  MIDGAME = 'midgame',
  REWARDED = 'rewarded',
}

declare global {
  interface Window {
    PokiSDK?: any
    CrazyGames?: any
  }
}

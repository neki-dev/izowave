import { GameAdType } from './game';

export interface ISDK {
  /**
   * Show advertising.
   * @param type - Ad type
   * @param callbackBeg - Start callback
   * @param callbackEnd - Complete callback
   */
  showAdv(
    type: GameAdType,
    callbackBeg: () => void,
    callbackEnd: (success: boolean) => void
  ): void
}

export enum SDKPlatform {
  CRAZY_GAMES = 'CRAZY_GAMES',
  POKI = 'POKI',
}

declare global {
  interface Window {
    PokiSDK?: any
    CrazyGames?: any
  }
}

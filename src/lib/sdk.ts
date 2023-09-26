import { SDK_PLATFORMS } from '~const/sdk';
import { GameAdType } from '~type/game';
import { ISDK, SDKPlatform } from '~type/sdk';

import { registerScript } from './utils';

export class SDK implements ISDK {
  private platform: SDKPlatform;

  constructor(platform: SDKPlatform) {
    try {
      registerScript(SDK_PLATFORMS[platform]).then(() => {
        this.platform = platform;

        switch (this.platform) {
          case SDKPlatform.POKI: {
            window.PokiSDK?.init();
          }
        }
      });
    } catch (error) {
      console.error('SDK initialization error:', error);
    }
  }

  public showAdv(
    type: GameAdType,
    callbackBeg: () => void,
    callbackEnd: (success: boolean) => void,
  ) {
    try {
      switch (this.platform) {
        case SDKPlatform.CRAZY_GAMES: {
          window.CrazyGames?.SDK?.ad?.requestAd(type, {
            adStarted: callbackBeg,
            adFinished: () => callbackEnd(true),
          });
          break;
        }
        case SDKPlatform.POKI: {
          const method = type === GameAdType.REWARDED ? 'rewardedBreak' : 'commercialBreak';

          window.PokiSDK?.[method](callbackBeg).then((success: boolean) => {
            callbackEnd(success);
          });
          break;
        }
      }
    } catch (error) {
      console.error('SDK Show adv error:', error);
    }
  }

  // public toggleLoadState(state: boolean) {
  //   switch (this.platform) {
  //     case SDKPlatform.CRAZY_GAMES: {
  //       if (state) {
  //         window.CrazyGames?.SDK?.game?.sdkGameLoadingStart();
  //       } else {
  //         window.CrazyGames?.SDK?.game?.sdkGameLoadingStop();
  //       }
  //       break;
  //     }
  //     case SDKPlatform.POKI: {
  //       if (!state) {
  //         window.PokiSDK?.gameLoadingFinished();
  //       }
  //       break;
  //     }
  //   }
  // }

  // public togglePlayState(state: boolean) {
  //   switch (this.platform) {
  //     case SDKPlatform.POKI: {
  //       if (state) {
  //         window.PokiSDK.gameplayStart();
  //       } else {
  //         window.PokiSDK.gameplayStop();
  //       }
  //     }
  //   }
  // }
}

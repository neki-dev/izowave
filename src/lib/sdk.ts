import { GameEnvironment, GamePlatform } from '~type/game';
import { SDKAdsType } from '~type/sdk';

export class SDK {
  public static async Register(environment: GameEnvironment) {
    if (!environment.sdk) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      // @ts-ignore
      script.setAttribute('src', environment.sdk);
      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);

      document.body.appendChild(script);
    })
      .then(() => {
        switch (window.PLATFORM) {
          case GamePlatform.POKI: {
            window.PokiSDK?.init();
          }
        }
      })
      .catch((error) => {
        console.error('SDK initialization error:', error);
      });
  }

  public static ShowAds(
    type: SDKAdsType,
    callbackBeg: () => void,
    callbackEnd: (success: boolean) => void,
  ) {
    try {
      switch (window.PLATFORM) {
        case GamePlatform.DEVELOPMENT: {
          callbackBeg();
          window.alert('Ads was showed');
          callbackEnd(true);
          break;
        }
        case GamePlatform.CRAZY_GAMES: {
          window.CrazyGames?.SDK.ad.requestAd(type, {
            adStarted: callbackBeg,
            adFinished: () => callbackEnd(true),
          });
          break;
        }
        case GamePlatform.POKI: {
          const method = type === SDKAdsType.REWARDED
            ? 'rewardedBreak'
            : 'commercialBreak';

          window.PokiSDK?.[method](callbackBeg).then((success: boolean) => {
            callbackEnd(success);
          });
          break;
        }
      }
    } catch (error) {
      console.error('SDK show adv error:', error);
    }
  }

  public static ToggleLoadState(state: boolean) {
    try {
      switch (window.PLATFORM) {
        case GamePlatform.CRAZY_GAMES: {
          if (state) {
            window.CrazyGames?.SDK.game.sdkGameLoadingStart();
          } else {
            window.CrazyGames?.SDK.game.sdkGameLoadingStop();
          }
          break;
        }
        case GamePlatform.POKI: {
          if (!state) {
            window.PokiSDK?.gameLoadingFinished();
          }
          break;
        }
      }
    } catch (error) {
      console.error('SDK load state error:', error);
    }
  }

  public static TogglePlayState(state: boolean) {
    try {
      switch (window.PLATFORM) {
        case GamePlatform.CRAZY_GAMES: {
          if (state) {
            window.CrazyGames?.SDK.game.gameplayStart();
          } else {
            window.CrazyGames?.SDK.game.gameplayStop();
          }
          break;
        }
        case GamePlatform.POKI: {
          if (state) {
            window.PokiSDK?.gameplayStart();
          } else {
            window.PokiSDK?.gameplayStop();
          }
          break;
        }
      }
    } catch (error) {
      console.error('SDK play state error:', error);
    }
  }
}

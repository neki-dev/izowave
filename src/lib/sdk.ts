import { Environment } from '~lib/environment';
import { GameFlag, GamePlatform } from '~type/game';
import { SDKAdsType } from '~type/sdk';

export class SDK {
  private static IsPlaying: boolean = false;

  public static async Register() {
    const sdk = Environment.GetSDK();

    if (!sdk) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.setAttribute('src', sdk);
      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);

      document.body.appendChild(script);
    })
      .then(() => {
        switch (Environment.Platform) {
          case GamePlatform.POKI: {
            window.PokiSDK?.init();
          }
        }
      })
      .catch((error) => {
        console.error('SDK initialization error:', error);
      });
  }

  public static ShowAds(type: SDKAdsType) {
    if (!Environment.GetFlag(GameFlag.ADS)) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      try {
        switch (Environment.Platform) {
          case GamePlatform.CRAZY_GAMES: {
            window.CrazyGames?.SDK.ad.requestAd(type, {
              adFinished: () => {
                const rewarded = (type === SDKAdsType.REWARDED);

                resolve(rewarded);
              },
              adError: () => {
                resolve(false);
              },
            });
            break;
          }
          case GamePlatform.POKI: {
            const method = type === SDKAdsType.REWARDED
              ? 'rewardedBreak'
              : 'commercialBreak';

            window.PokiSDK?.[method]().then((success: boolean) => {
              const rewarded = (type === SDKAdsType.REWARDED && success);

              resolve(rewarded);
            });
            break;
          }
          default: {
            console.error('Undefined ads platform handler');
            resolve(false);
            break;
          }
        }
      } catch (error) {
        console.error('SDK show ads error:', error);
        resolve(false);
      }
    });
  }

  public static ToggleLoadState(state: boolean) {
    try {
      switch (Environment.Platform) {
        case GamePlatform.DEVELOPMENT: {
          // console.log('Toggle load state to', state);
          break;
        }
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
    if (this.IsPlaying === state) {
      console.warn('Unnecessary changing play state to', state);

      return;
    }

    try {
      this.IsPlaying = state;

      switch (Environment.Platform) {
        case GamePlatform.DEVELOPMENT: {
          // console.log('Toggle play state to', state);
          break;
        }
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

import { SDK_PLATFORMS } from '~const/sdk';
import { SDKPlatform, SDKAdvType } from '~type/sdk';

export class SDK {
  private static Platform: Nullable<SDKPlatform> = null;

  public static async Register() {
    const query = new URLSearchParams(window.location.search);
    const platform = <SDKPlatform> query.get('sdk')?.toUpperCase();

    if (!platform || !SDKPlatform[platform]) {
      return;
    }

    this.Platform = platform;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.setAttribute('src', SDK_PLATFORMS[platform]);
      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);

      document.body.appendChild(script);
    })
      .then(() => {
        switch (this.Platform) {
          case SDKPlatform.POKI: {
            window.PokiSDK?.init();
          }
        }
      })
      .catch((error) => {
        console.error('SDK initialization error:', error);
      });
  }

  public static ShowAdv(
    type: SDKAdvType,
    callbackBeg: () => void,
    callbackEnd: (success: boolean) => void,
  ) {
    if (!this.Platform) {
      return;
    }

    try {
      switch (this.Platform) {
        case SDKPlatform.CRAZY_GAMES: {
          window.CrazyGames?.SDK?.ad?.requestAd(type, {
            adStarted: callbackBeg,
            adFinished: () => callbackEnd(true),
          });
          break;
        }
        case SDKPlatform.POKI: {
          const method = type === SDKAdvType.REWARDED
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
    if (!this.Platform) {
      return;
    }

    try {
      switch (this.Platform) {
        case SDKPlatform.CRAZY_GAMES: {
          if (state) {
            window.CrazyGames?.SDK.game.sdkGameLoadingStart();
          } else {
            window.CrazyGames?.SDK.game.sdkGameLoadingStop();
          }
          break;
        }
        case SDKPlatform.POKI: {
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
    if (!this.Platform) {
      return;
    }

    try {
      switch (this.Platform) {
        case SDKPlatform.CRAZY_GAMES: {
          if (state) {
            window.CrazyGames?.SDK.game.gameplayStart();
          } else {
            window.CrazyGames?.SDK.game.gameplayStop();
          }
          break;
        }
        case SDKPlatform.POKI: {
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

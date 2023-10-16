import { ENVIRONMENTS } from '~const/game';
import { GameFlag, GamePlatform } from '~type/game';

export class Environment {
  public static Platform: GamePlatform;

  public static Register() {
    this.Platform = this.GetCustomPlatform() ?? PLATFORM;

    if (!this.Platform) {
      throw Error('Invalid environment platform');
    }
  }

  public static GetFlag(flag: GameFlag) {
    return ENVIRONMENTS[this.Platform].flags[flag];
  }

  public static GetSDK() {
    return ENVIRONMENTS[this.Platform].sdk;
  }

  private static GetCustomPlatform() {
    const customPlatform = new URLSearchParams(window.location.search).get('sdk')?.toLowerCase();

    if (customPlatform && customPlatform in ENVIRONMENTS) {
      return customPlatform as GamePlatform;
    }
  }
}

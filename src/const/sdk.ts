import { SDKPlatform } from '~type/sdk';

export const SDK_PLATFORMS: Record<SDKPlatform, string> = {
  [SDKPlatform.CRAZY_GAMES]: 'https://sdk.crazygames.com/crazygames-sdk-v2.js',
  [SDKPlatform.POKI]: 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js',
};

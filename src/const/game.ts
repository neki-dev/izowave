import { GameEnvironment, GameFlag, GamePlatform } from '~type/game';

export const CONTAINER_ID = 'game-container';

export const AUDIO_VOLUME = 0.1;

export const MAX_GAME_SAVES = 5;

export const DEBUG_MODS = {
  basic: false,
  position: false,
  path: false,
};

export const ENVIRONMENTS: Record<GamePlatform, GameEnvironment> = {
  [GamePlatform.POKI]: {
    sdk: 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js',
    flags: {
      [GameFlag.NO_BLOOD]: true,
      [GameFlag.ADS]: true,
    },
  },
  [GamePlatform.CRAZY_GAMES]: {
    sdk: 'https://sdk.crazygames.com/crazygames-sdk-v2.js',
    flags: {
      [GameFlag.NO_BLOOD]: true,
      [GameFlag.ADS]: true,
    },
  },
  [GamePlatform.VANILLA]: {
    flags: {},
  },
  [GamePlatform.DEVELOPMENT]: {
    flags: {
      [GameFlag.ADS]: true,
    },
  },
};

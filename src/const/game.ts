import { GameSettings, GameSettingsData } from '~type/game';

export const CONTAINER_ID = 'game-container';

export const AUDIO_VOLUME = 0.1;

export const MAX_GAME_SAVES = 5;

export const DEBUG_MODS = {
  basic: false,
  position: false,
  path: false,
};

export const SETTINGS: Record<GameSettings, GameSettingsData> = {
  [GameSettings.TUTORIAL]: {
    values: ['on', 'off'],
    default: 'on',
  },
  [GameSettings.AUDIO]: {
    values: ['on', 'off'],
    default: 'on',
  },
  [GameSettings.SHOW_DAMAGE]: {
    values: ['on', 'off'],
    default: 'on',
    onlyDesktop: true,
  },
  [GameSettings.EFFECTS]: {
    values: ['on', 'off'],
    default: 'on',
  },
};

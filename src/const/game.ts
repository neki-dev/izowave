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
    description: 'Tutorial',
    values: ['on', 'off'],
    default: 'on',
  },
  [GameSettings.AUDIO]: {
    description: 'Audio',
    values: ['on', 'off'],
    default: 'on',
  },
  [GameSettings.SHOW_DAMAGE]: {
    description: 'Show damage',
    values: ['on', 'off'],
    default: 'off',
  },
  [GameSettings.EFFECTS]: {
    description: 'Effects',
    values: ['on', 'off'],
    default: 'on',
  },
};

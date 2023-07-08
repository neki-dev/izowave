import pkg from '../../package.json';
import { GameSettings, GameSettingsData } from '~type/game';

export const CONTAINER_ID = 'game-container';

export const AUDIO_VOLUME = 0.1;

export const MIN_VALID_SCREEN_SIZE = [800, 480];

export const DEBUG_MODS = {
  basic: false,
  position: false,
  path: false,
};

export const COPYRIGHT = [
  `© ${pkg.author.name}, 2022-2023`,
  `Version ${pkg.version}`,
];

export const REPOSITORY = pkg.repository.url.replace('git+', '');

export const SETTINGS: Record<GameSettings, GameSettingsData> = {
  [GameSettings.DIFFICULTY]: {
    description: 'Difficulty',
    values: ['easy', 'medium', 'hard'],
    default: 'medium',
    runtime: false,
  },
  [GameSettings.TUTORIAL]: {
    description: 'Tutorial',
    values: ['on', 'off'],
    default: 'on',
    runtime: false,
  },
  [GameSettings.AUDIO]: {
    description: 'Audio',
    values: ['on', 'off'],
    default: 'on',
    runtime: true,
  },
  [GameSettings.EFFECTS]: {
    description: 'Effects',
    values: ['on', 'off'],
    default: 'on',
    runtime: true,
  },
};

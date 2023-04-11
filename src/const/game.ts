import pkg from '../../package.json';
import { GameSettings, GameSettingsData } from '~type/game';

export const CONTAINER_ID = 'game-container';

export const AUDIO_VOLUME = 0.1;

export const MIN_VALID_SCREEN_SIZE = [800, 480];

export const COPYRIGHT = [
  '© Nikita Galadiy, 2022-2023',
  `Version ${pkg.version} beta`,
];

export const REPOSITORY = pkg.repository.url.replace('git+', '');

export const SETTINGS: Record<GameSettings, GameSettingsData> = {
  [GameSettings.DIFFICULTY]: {
    description: 'Difficulty',
    values: ['easy', 'medium', 'hard'],
    default: 'medium',
    runtime: false,
  },
  [GameSettings.BLOOD_ON_MAP]: {
    description: 'Add blood on map',
    values: ['on', 'off'],
    default: 'on',
    runtime: true,
  },
  [GameSettings.AUDIO]: {
    description: 'Audio effects',
    values: ['on', 'off'],
    default: 'on',
    runtime: true,
  },
};

import { DifficultyPowers } from '~type/core';

import pkg from '../../package.json';

export const MIN_VALID_SCREEN_SIZE = [800, 480];

export const AUDIO_VOLUME = 0.1;

export const DIFFICULTY_KEY = 'GAME_DIFFICULTY';
export const DIFFICULTY_POWERS: DifficultyPowers = {
  EASY: 0.8,
  NORMAL: 1.0,
  HARD: 1.3,
};

export const COPYRIGHT = [
  'Copyright © 2022, Nikita Galadiy',
  `Version ${pkg.version} beta`,
];

export const REPOSITORY = pkg.repository.url.replace('git+', '');

import { removeFailure, throwFailure } from '~lib/state';
import { GamePlatform } from '~type/game';
import { FailureType } from '~type/state';

import pkg from '../package.json';

import { Game } from '~game';

const game = new Game();

if (ENV_MODE === GamePlatform.DEVELOPMENT) {
  window.GAME = game;
}

const checkScreenOrientation = (event?: MediaQueryListEvent) => {
  if (event ? event.matches : window.innerWidth >= window.innerHeight) {
    removeFailure(FailureType.BAD_SCREEN_SIZE);
  } else {
    throwFailure(FailureType.BAD_SCREEN_SIZE);
  }
};

checkScreenOrientation();
window.matchMedia('(orientation: landscape)')
  .addEventListener('change', checkScreenOrientation);

console.clear();
console.log([
  `Created by ${pkg.author.name} / ${pkg.author.url}`,
  `Build v${pkg.version}-${ENV_MODE}`,
  `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
].join('\n'));

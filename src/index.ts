import { removeFailure, throwFailure } from '~lib/state';
import { FailureType } from '~type/state';

import pkg from '../package.json';

import { Game } from '~game';

console.clear();
console.log([
  `Created by ${pkg.author.name} / ${pkg.author.url}`,
  `Version ${pkg.version}`,
  `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
].join('\n'));

function checkScreenOrientation() {
  if (window.innerWidth > window.innerHeight) {
    removeFailure(FailureType.BAD_SCREEN_SIZE);
  } else {
    throwFailure(FailureType.BAD_SCREEN_SIZE);
  }
}

checkScreenOrientation();
window.addEventListener('resize', checkScreenOrientation);

const game = new Game();

if (IS_DEV_MODE) {
  window.GAME = game;
}

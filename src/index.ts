import { ENVIRONMENTS } from '~const/game';
import { SDK } from '~lib/sdk';
import { removeFailure, throwFailure } from '~lib/state';
import { GamePlatform } from '~type/game';
import { FailureType } from '~type/state';

import pkg from '../package.json';

import { Game } from '~game';

const customPlatform = new URLSearchParams(window.location.search).get('sdk')?.toLowerCase();

if (customPlatform && customPlatform in ENVIRONMENTS) {
  window.PLATFORM = customPlatform as GamePlatform;
}

console.clear();
console.log([
  `Created by ${pkg.author.name} / ${pkg.author.url}`,
  `Build v${pkg.version}-${window.PLATFORM}`,
  `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
].join('\n'));

function checkScreenOrientation(event?: MediaQueryListEvent) {
  if (event ? event.matches : window.innerWidth >= window.innerHeight) {
    removeFailure(FailureType.BAD_SCREEN_SIZE);
  } else {
    throwFailure(FailureType.BAD_SCREEN_SIZE);
  }
}

checkScreenOrientation();
window.matchMedia('(orientation: landscape)')
  .addEventListener('change', checkScreenOrientation);

const environment = Game.GetEnvironment();

SDK.Register(environment).then(() => {
  const game = new Game();

  if (window.PLATFORM === 'development') {
    window.GAME = game;
  }
});

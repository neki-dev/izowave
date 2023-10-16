import { Environment } from '~lib/environment';
import { SDK } from '~lib/sdk';
import { removeFailure, throwFailure } from '~lib/state';
import { FailureType } from '~type/state';

import pkg from '../package.json';

import { Game } from '~game';

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

Environment.Register();
SDK.Register().then(() => {
  const game = new Game();

  if (Environment.Platform === 'development') {
    window.GAME = game;
  }
});

console.clear();
console.log([
  `Created by ${pkg.author.name} / ${pkg.author.url}`,
  `Build v${pkg.version}-${Environment.Platform}`,
  `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
].join('\n'));

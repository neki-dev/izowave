import { removeFailure, throwFailure } from '~lib/state';
import { isValidScreenSize, isMobileDevice } from '~lib/utils';
import { FailureType } from '~type/state';

import pkg from '../package.json';

import { Game } from '~game';

(async () => {
  console.clear();
  console.log([
    `Created by ${pkg.author.name} / ${pkg.author.url}`,
    `Version ${pkg.version}`,
    `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
  ].join('\n'));

  if (!IS_DEV_MODE && isMobileDevice()) {
    throwFailure(FailureType.BAD_DEVICE);

    return;
  }

  function checkScreenSize() {
    if (isValidScreenSize()) {
      removeFailure(FailureType.BAD_SCREEN_SIZE);
    } else {
      throwFailure(FailureType.BAD_SCREEN_SIZE);
    }
  }

  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);

  const game = new Game();

  if (IS_DEV_MODE) {
    window.GAME = game;
  }
})();

import { COPYRIGHT, REPOSITORY } from '~const/core';
import { INTERFACE_FONT } from '~const/interface';
import { initAnalytics } from '~lib/analytics';
import { loadFontFace } from '~lib/assets';
import { removeFailure, throwFailure } from '~lib/state';
import { isValidScreenSize, isMobileDevice } from '~lib/utils';
import { FailureType } from '~type/state';

import { Game } from './game';

declare global {
  const IS_DEV_MODE: boolean;
}

(async () => {
  console.clear();
  console.log([...COPYRIGHT, `Source at ${REPOSITORY}`].join('\n'));

  initAnalytics();

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

  await loadFontFace(INTERFACE_FONT.PIXEL, 'retro');

  try {
    new Game();
  } catch (e) {
    throwFailure(FailureType.UNCAUGHT_ERROR);
  }
})();

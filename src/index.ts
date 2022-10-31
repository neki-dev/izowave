import { Game } from 'phaser';
import { COPYRIGHT, REPOSITORY } from '~const/core';
import { INTERFACE_FONT } from '~const/interface';
import { loadFontFace } from '~lib/assets';
import { removeFailure, throwFailure } from '~lib/state';
import { isValidScreenSize, isMobileDevice } from '~lib/utils';
import { Menu } from '~scene/menu';
import { Screen } from '~scene/screen';
import { World } from '~scene/world';
import { FailureType } from '~type/core';

declare global {
  const IS_DEV_MODE: boolean;
}

function bootGame() {
  new Game({
    scene: [World, Screen, Menu],
    pixelArt: true,
    autoRound: true,
    disableContextMenu: true,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-screen',
    backgroundColor: '#222',
    scale: {
      mode: Phaser.Scale.RESIZE,
    },
    physics: {
      default: 'arcade',
      arcade: {
        // debug: IS_DEV_MODE,
        fps: 60,
        gravity: { y: 0 },
      },
    },
  });
}

(async () => {
  console.clear();
  console.log([...COPYRIGHT, `Source at ${REPOSITORY}`].join('\n'));

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
    bootGame();
  } catch (e) {
    throwFailure(FailureType.UNCAUGHT_ERROR);
  }
})();

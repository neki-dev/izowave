import { Game } from 'phaser';
import { COPYRIGHT } from '~const/core';
import { setLoaderStatus, stopLoader } from '~lib/loader';
import { isValidScreenSize, isMobileDevice } from '~lib/utils';
import { Menu } from '~scene/menu';
import { Screen } from '~scene/screen';
import { World } from '~scene/world';

declare global {
  const IS_DEV_MODE: boolean;
}

console.log([
  ...COPYRIGHT,
  'Source at https://github.com/neki-dev/izowave',
].join('\n'));

function bootGame() {
  new Game({
    scene: [World, Screen, Menu],
    parent: 'game-screen',
    physics: {
      default: 'arcade',
      arcade: {
        // debug: IS_DEV_MODE,
        fps: 60,
        gravity: { y: 0 },
      },
    },
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    autoRound: true,
    disableContextMenu: true,
    backgroundColor: '#222',
    scale: {
      mode: Phaser.Scale.RESIZE,
    },
  });
}

if (!IS_DEV_MODE && isMobileDevice()) {
  stopLoader();
  setLoaderStatus('DEVICE IS NOT SUPPORTED :(');
} else if (!isValidScreenSize()) {
  stopLoader();
  setLoaderStatus('SCREEN SIZE IS NOT SUPPORTED :(');
} else {
  bootGame();
}

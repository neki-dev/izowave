import { Game } from 'phaser';
import { COPYRIGHT } from '~const/core';
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
  disableContextMenu: true,
  backgroundColor: '#222',
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
});

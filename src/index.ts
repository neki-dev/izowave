import { Game } from 'phaser';
import { COPYRIGHT } from '~const/core';
import MenuScene from '~scene/menu';
import InterfaceScene from '~scene/screen';
import WorldScene from '~scene/world';

declare global {
  const IS_DEV_MODE: boolean;
}

console.log([
  ...COPYRIGHT,
  'Source at https://github.com/neki-dev/izowave',
].join('\n'));

new Game({
  scene: [WorldScene, InterfaceScene, MenuScene],
  parent: 'game-screen',
  physics: {
    default: 'arcade',
    arcade: {
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

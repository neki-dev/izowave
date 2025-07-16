import { Interface } from 'phaser-react-ui';

import { Scene } from '..';
import { Level } from '../world/level';
import { LEVEL_MAP_SIZE } from '../world/level/const';

import { MenuUI } from './interface';
import type { MenuData } from './types';

import { GameScene } from '~game/types';

export class MenuScene extends Scene {
  constructor() {
    super(GameScene.MENU);
  }

  public create({
    defaultPage,
    planet,
    background = true,
  }: MenuData) {
    const ui = new Interface(this);
    ui.render(MenuUI, { defaultPage });

    if (background) {
      new Level(this, { planet });
      this.focusOnLevel();
    }
  }

  private focusOnLevel() {
    const camera = this.cameras.main;
    const size = LEVEL_MAP_SIZE - 1;
    const beg = Level.ToWorldPosition({ x: 0, y: size }, 0);
    const end = Level.ToWorldPosition({ x: size, y: 0 }, 0);

    camera.setZoom(1.0);
    camera.pan(beg.x + (this.game.canvas.width / 2), beg.y, 0);
    setTimeout(() => {
      camera.pan(end.x - (this.game.canvas.width / 2), end.y, 2 * 60 * 1000);
    }, 0);
  }
}

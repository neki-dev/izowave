import { Interface } from 'phaser-react-ui';

import { Scene } from '..';

import { MenuUI } from './interface';
import type { MenuPage } from './types';

import { GameScene, GameState } from '~game/types';

export class Menu extends Scene {
  constructor() {
    super(GameScene.MENU);
  }

  public create(data: { defaultPage: MenuPage }) {
    const ui = new Interface(this);
    ui.render(MenuUI, data);

    if (this.game.state === GameState.IDLE) {
      this.game.world.camera.focusOnLevel();
    }
  }
}

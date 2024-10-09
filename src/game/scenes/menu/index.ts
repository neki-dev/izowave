import { Interface } from 'phaser-react-ui';

import { MenuUI } from './interface';
import { Scene } from '..';

import type { MenuPage } from './types';

import { GameScene, GameState } from '~game/types';

export class Menu extends Scene {
  constructor() {
    super(GameScene.MENU);
  }

  public create(data: { defaultPage: MenuPage }) {
    new Interface(this, MenuUI, data);

    if (this.game.state === GameState.IDLE) {
      this.game.world.camera.focusOnLevel();
    }
  }
}

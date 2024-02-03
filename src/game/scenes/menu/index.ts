import { Interface } from 'phaser-react-ui';

import { Scene } from '..';
import { GameScene, GameState } from '../../types';

import { MenuUI } from './interface';
import { MenuPage } from './types';

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

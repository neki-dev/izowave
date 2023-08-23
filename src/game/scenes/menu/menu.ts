import { Interface } from 'phaser-react-ui';

import { Scene } from '~game/scenes';
import { GameScene, GameState } from '~type/game';
import { MenuPage } from '~type/menu';

import { MenuUI } from './interface';

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

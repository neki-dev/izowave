import { Interface } from 'phaser-react-ui';

import { CONTROL_KEY } from '~const/controls';
import { Scene } from '~game/scenes';
import { GameScene } from '~type/game';

import { MenuUI } from './interface';

export class Menu extends Scene {
  constructor() {
    super(GameScene.MENU);
  }

  public create() {
    new Interface(this, MenuUI);

    if (!this.game.onPause) {
      this.game.world.camera.focusOnLevel();

      this.input.keyboard?.once(CONTROL_KEY.START, () => {
        this.game.startGame();
      });
    }
  }
}

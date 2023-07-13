import { Interface } from 'phaser-react-ui';

import { CONTROL_KEY } from '~const/controls';
import { WORLD_MAX_ZOOM } from '~const/world';
import { Scene } from '~game/scenes';
import { Level } from '~scene/world/level';
import { GameScene } from '~type/game';

import { MenuUI } from './interface';

export class Menu extends Scene {
  constructor() {
    super(GameScene.MENU);
  }

  public create() {
    new Interface(this, MenuUI);

    if (!this.game.onPause) {
      this.setCameraPreview();

      this.input.keyboard?.once(CONTROL_KEY.START, () => {
        this.game.startGame();
      });
    }
  }

  private setCameraPreview() {
    const camera = this.game.world.cameras.main;
    const size = this.game.world.level.size - 1;
    const beg = Level.ToWorldPosition({ x: 0, y: size, z: 0 });
    const end = Level.ToWorldPosition({ x: size, y: 0, z: 0 });

    camera.setZoom(WORLD_MAX_ZOOM);
    camera.pan(beg.x + (this.sys.canvas.width / 2), beg.y, 0);
    setTimeout(() => {
      camera.pan(end.x - (this.sys.canvas.width / 2), end.y, 2 * 60 * 1000);
    }, 0);
  }
}

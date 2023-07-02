import Phaser from 'phaser';

import { CONTROL_KEY } from '~const/controls';
import { Interface } from '~lib/interface';
import { Level } from '~scene/world/level';
import { IGame, GameScene } from '~type/game';
import { IMenu } from '~type/menu';

import { MenuUI } from './ui';

export class Menu extends Phaser.Scene implements IMenu {
  readonly game: IGame;

  constructor() {
    super(GameScene.MENU);
  }

  public create() {
    new Interface(this, MenuUI);

    if (!this.game.onPause) {
      this.setCameraPreview();

      this.input.keyboard.once(CONTROL_KEY.START, () => {
        this.game.startGame();
      });
    }
  }

  private setCameraPreview() {
    const camera = this.game.world.cameras.main;
    const size = this.game.world.level.size - 1;
    const beg = Level.ToWorldPosition({ x: 0, y: size, z: 0 });
    const end = Level.ToWorldPosition({ x: size, y: 0, z: 0 });

    camera.setZoom(1.8);
    camera.pan(beg.x + (this.sys.canvas.width / 2), beg.y, 0);
    setTimeout(() => {
      camera.pan(end.x - (this.sys.canvas.width / 2), end.y, 2 * 60 * 1000);
    }, 0);
  }
}

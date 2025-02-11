import { Interface } from 'phaser-react-ui';

import { Scene } from '..';

import { GameoverUI } from './interface';

import { GameScene } from '~game/types';

export class Gameover extends Scene {
  constructor() {
    super(GameScene.GAMEOVER);
  }

  public create(data: any) {
    const ui = new Interface(this);
    ui.render(GameoverUI, data);
  }
}

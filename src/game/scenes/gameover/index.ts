import { Interface } from 'phaser-react-ui';

import { Scene } from '..';
import { GameScene } from '../../types';

import { GameoverUI } from './interface';

export class Gameover extends Scene {
  constructor() {
    super(GameScene.GAMEOVER);
  }

  public create(data: any) {
    new Interface(this, GameoverUI, data);
  }
}

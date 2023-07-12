import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';

import { IGame, IScene, GameScene } from '~type/game';

import { GameoverUI } from './interface';

export class Gameover extends Phaser.Scene implements IScene {
  readonly game: IGame;

  constructor() {
    super(GameScene.GAMEOVER);
  }

  public create(data: any) {
    new Interface(this, GameoverUI, data);
  }
}

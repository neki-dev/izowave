import Phaser from 'phaser';

import { Interface } from '~lib/interface';
import { IGame, IScene, GameScene } from '~type/game';

import { GameoverUI } from './ui';

export class Gameover extends Phaser.Scene implements IScene {
  readonly game: IGame;

  constructor() {
    super(GameScene.GAMEOVER);
  }

  public create(data: any) {
    new Interface(this, GameoverUI, data);
  }
}

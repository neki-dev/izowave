import Phaser from 'phaser';

import { Interface } from '~lib/interface';
import { SceneKey } from '~type/game';

import { GameoverUI } from './ui';

import { Game } from '~game';

export class Gameover extends Phaser.Scene {
  readonly game: Game;

  /**
   * Gameover constructor.
   */
  constructor() {
    super(SceneKey.GAMEOVER);
  }

  /**
   * Create gameover.
   */
  public create(data: any) {
    new Interface(this, GameoverUI, data);
  }
}

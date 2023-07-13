import Phaser from 'phaser';

import { IGame } from './game';

export interface IScene extends Phaser.Scene {
  readonly game: IGame
}

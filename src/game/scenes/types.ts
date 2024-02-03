import Phaser from 'phaser';

import { IGame } from '../types';

export interface IScene extends Phaser.Scene {
  readonly game: IGame
}

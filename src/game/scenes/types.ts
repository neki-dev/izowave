import type Phaser from 'phaser';

import type { IGame } from '../types';

export interface IScene extends Phaser.Scene {
  readonly game: IGame
}

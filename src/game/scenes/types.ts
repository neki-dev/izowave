import type { IGame } from '../types';
import type Phaser from 'phaser';

export interface IScene extends Phaser.Scene {
  readonly game: IGame
}

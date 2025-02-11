import Phaser from 'phaser';

import type { IGame } from '../types';

import type { IScene } from './types';

export class Scene extends Phaser.Scene implements IScene {
  readonly game: IGame;
}

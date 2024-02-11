import Phaser from 'phaser';

import type { IScene } from './types';
import type { IGame } from '../types';

export class Scene extends Phaser.Scene implements IScene {
  readonly game: IGame;
}

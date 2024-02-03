import Phaser from 'phaser';

import { IScene } from './types';
import { IGame } from '../types';

export class Scene extends Phaser.Scene implements IScene {
  readonly game: IGame;
}

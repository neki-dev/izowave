import Phaser from 'phaser';

import { IGame } from '~type/game';
import { IScene } from '~type/scene';

export class Scene extends Phaser.Scene implements IScene {
  readonly game: IGame;
}

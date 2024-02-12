import type Phaser from 'phaser';

import type { IWorld } from '~scene/world/types';

import type { IShot } from '../types';

export interface IShotLazer extends Phaser.GameObjects.Line, IShot {
  readonly scene: IWorld
}

export enum ShotLazerAudio {
  LAZER = 'shot/lazer',
}

import type Phaser from 'phaser';

import type { IShot } from '../types';

import type { IWorld } from '~scene/world/types';

export interface IShotLazer extends Phaser.GameObjects.Line, IShot {
  readonly scene: IWorld
}

export enum ShotLazerAudio {
  LAZER = 'shot/lazer',
}

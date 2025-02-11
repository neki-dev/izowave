import type Phaser from 'phaser';

import type { IShot, ShotData } from '../types';

import type { IWorld } from '~scene/world/types';

export interface IShotBall extends Phaser.Physics.Arcade.Image, IShot {
  readonly scene: IWorld
  readonly body: Phaser.Physics.Arcade.Body
}

export enum ShotBallAudio {
  FIRE = 'shot/ball_fire',
  FROZEN = 'shot/ball_frozen',
  SIMPLE = 'shot/ball_simple',
}

export type ShotBallData = ShotData & {
  audio: ShotBallAudio
  color: number
  glow?: boolean
};

import type Phaser from 'phaser';

import type { IParticlesParent } from '~scene/world/fx-manager/particles/types';
import type { PositionAtWorld } from '~scene/world/level/types';
import type { IWorld } from '~scene/world/types';

import type { IEnemy } from '../npc/enemy/types';

export interface IShot extends IParticlesParent {
  /**
   * Shot params.
   */
  readonly params: ShotParams

  /**
   * Set shoots initiator.
   * @param initiator - Initiator
   * @param positionCallback - Function for getting start position
   */
  setInitiator(parent: IShotInitiator, positionCallback?: Nullable<() => PositionAtWorld>): void

  /**
   * Make shoot to target.
   * @param target - Enemy
   * @param params - Shot params
   */
  shoot(target: IEnemy, params?: ShotParams): void
}

export interface IShotLazer extends Phaser.GameObjects.Line, IShot {
  readonly scene: IWorld
}

export interface IShotBall extends Phaser.Physics.Arcade.Image, IShot {
  readonly scene: IWorld
  readonly body: Phaser.Physics.Arcade.Body
}

export interface IShotInitiator extends Phaser.GameObjects.GameObject {
  readonly scene: IWorld
  x: number
  y: number
  getBottomEdgePosition(): PositionAtWorld
}

export interface IShotFactory {
  new (scene: IWorld, params: ShotParams, ...args: any[]): IShot
}

export enum ShotLazerAudio {
  LAZER = 'shot/lazer',
}

export enum ShotTexture {
  BALL = 'shot/ball',
}

export enum ShotBallAudio {
  FIRE = 'shot/ball_fire',
  FROZEN = 'shot/ball_frozen',
  SIMPLE = 'shot/ball_simple',
}

export type ShotParams = {
  speed?: number
  maxDistance?: number
  damage?: number
  freeze?: number
};

export type ShotData = {
  scale?: number
};

export type ShotBallData = ShotData & {
  audio: ShotBallAudio
  color: number
  glow?: boolean
};

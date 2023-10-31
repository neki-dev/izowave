import Phaser from 'phaser';

import { IWorld } from '~type/world';
import { IParticlesParent } from '~type/world/effects';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { PositionAtWorld } from '~type/world/level';

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
}

export interface IShotFactory {
  new (scene: IWorld, params: ShotParams, ...args: any[]): IShot
}

export enum ShotLazerAudio {
  LAZER = 'shot/lazer',
}

export enum ShotBallTexture {
  FIRE = 'shot/fire',
  FROZEN = 'shot/frozen',
}

export enum ShotBallAudio {
  FIRE = 'shot/ball_fire',
  FROZEN = 'shot/ball_frozen',
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
  texture: ShotBallTexture
  audio: ShotBallAudio
  glowColor?: Nullable<number>
};

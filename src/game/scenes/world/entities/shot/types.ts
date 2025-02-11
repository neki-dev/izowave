import type Phaser from 'phaser';

import type { IEnemy } from '../npc/enemy/types';

import type { IParticlesParent } from '~scene/world/fx-manager/particles/types';
import type { PositionAtWorld } from '~scene/world/level/types';
import type { IWorld } from '~scene/world/types';

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

export interface IShotInitiator extends Phaser.GameObjects.GameObject {
  readonly scene: IWorld
  x: number
  y: number
  getBottomEdgePosition(): PositionAtWorld
}

export interface IShotFactory {
  new (scene: IWorld, params: ShotParams, ...args: any[]): IShot
}

export enum ShotTexture {
  BALL = 'shot/ball',
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

import type Phaser from 'phaser';

import type { WorldScene } from '../..';
import type { Enemy } from '../npc/enemy';

import type { IParticlesParent } from '~scene/world/fx-manager/particles/types';
import type { PositionAtWorld } from '~scene/world/level/types';

export interface IShot extends IParticlesParent {
  readonly params: ShotParams
  setInitiator(parent: IShotInitiator, positionCallback?: Nullable<() => PositionAtWorld>): void
  shoot(target: Enemy, params?: ShotParams): void
}

export interface IShotInitiator extends Phaser.GameObjects.GameObject {
  readonly scene: WorldScene
  readonly x: number
  readonly y: number
  getBottomEdgePosition(): PositionAtWorld
}

export interface IShotFactory {
  new (scene: WorldScene, params: ShotParams, ...args: any[]): IShot
}

export enum ShotTexture {
  BALL = 'ShotTexture:BALL',
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

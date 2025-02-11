import type Phaser from 'phaser';

import type { IParticlesParent } from '../fx-manager/particles/types';
import type { PositionAtMatrix, LevelBiome, PositionAtWorld } from '../level/types';
import type { IWorld } from '../types';

import type { IndicatorData } from './addons/indicator/types';
import type { ILive } from './addons/live/types';

export interface ISprite extends Phaser.Physics.Arcade.Sprite, IParticlesParent {
  readonly scene: IWorld
  readonly body: Phaser.Physics.Arcade.Body

  /**
   * Health management.
   */
  readonly live: ILive

  /**
   * Current position at matrix.
   */
  readonly positionAtMatrix: PositionAtMatrix

  /**
   * Sprite wrapper.
   */
  readonly container: Phaser.GameObjects.Container

  /**
   * Movement speed.
   */
  speed: number

  /**
   * Depth of sprite size.
   */
  gamut: number

  /**
   * Current biome.
   */
  currentBiome: Nullable<LevelBiome>

  /**
   * Check is body is stopped.
   */
  isStopped(): boolean

  /**
   * Get all occupied positions by body.
   */
  getAllPositionsAtMatrix(): PositionAtMatrix[]

  /**
   * Get position with gamut offset.
   */
  getBottomEdgePosition(): PositionAtWorld

  /**
   * Get body offset by position.
   */
  getBodyOffset(): PositionAtWorld

}

export type SpriteBodyData = {
  type: 'rect' | 'circle'
  width: number
  height: number
  gamut: number
};

export type SpriteData = {
  texture: string
  positionAtMatrix?: PositionAtMatrix
  positionAtWorld?: PositionAtWorld
  frame?: number
  health?: number
  speed: number
  body: SpriteBodyData
};

export type SpriteIndicatorData = Omit<IndicatorData, 'size'> & {
  value: () => number
};

export enum EntityType {
  BUILDING = 'BUILDING',
  NPC = 'NPC',
  ENEMY = 'ENEMY',
  SHOT = 'SHOT',
  CRYSTAL = 'CRYSTAL',
  SPRITE = 'SPRITE',
}

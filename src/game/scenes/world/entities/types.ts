import Phaser from 'phaser';

import { IIndicator, IndicatorData } from './addons/indicator/types';
import { ILive } from './addons/live/types';
import { IParticlesParent } from '../fx-manager/particles/types';
import {
  PositionAtMatrix, LevelBiome, PositionAtWorld, TileType,
} from '../level/types';
import { IWorld } from '../types';

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
   * Add collider handler.
   * @param target - Entity type
   * @param callback - Handler
   * @param overlap - Overlap mode
   */
  addCollider(target: EntityType, mode: 'overlap' | 'collider', callback: (sprite: any) => void): void

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

  /**
   * Set collision for tiles.
   * @param targets - Tile types
   * @param handler - Collision handler
   */
  setTilesCollision(targets: TileType[], handler: (tile: Phaser.GameObjects.Image) => void): void

  /**
   * Set state of checking ground collision.
   * @param state - Checking state
   */
  setTilesGroundCollision(state: boolean): void

  /**
   * Handle tiles collide and return result.
   * @param direction - Rotation in degrees
   */
  handleCollide(direction: number): boolean

  /**
   * Add indicator above sprite.
   * @param key - Unique key
   * @param data - Indicator parameters
   */
  addIndicator(key: string, data: SpriteIndicatorData): void

  /**
   * Get indicator by key.
   * @param key - Unique key
   */
  getIndicator(key: string): Nullable<IIndicator>
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

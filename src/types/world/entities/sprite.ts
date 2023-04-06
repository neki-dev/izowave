import { IWorld } from '~type/world';
import { IParticlesParent } from '~type/world/effects';
import { TileType, Vector2D } from '~type/world/level';

import { ILive } from './live';

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
  readonly positionAtMatrix: Vector2D

  /**
   * Sprite wrapper.
   */
  readonly container: Phaser.GameObjects.Container

  /**
   * Check is body is stopped.
   */
  isStopped(): boolean

  /**
   * Get all occupied positions by body.
   */
  getAllPositionsAtMatrix(): Vector2D[]

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
   */
  handleCollide(direction: number): boolean
}

export type SpriteData = {
  texture: string
  positionAtMatrix: Vector2D
  frame?: number
  health: number
};

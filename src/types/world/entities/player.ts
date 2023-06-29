import { ILive } from '~type/world/entities/live';
import { IEnemyTarget } from '~type/world/entities/npc/enemy';
import { ISprite } from '~type/world/entities/sprite';
import { Vector2D } from '~type/world/level';

export interface IPlayer extends ISprite, IEnemyTarget {
  /**
   * Total number of killed enemies.
   */
  readonly kills: number

  /**
   * Current level.
   */
  readonly level: number

  /**
   * Player experience on current level.
   */
  readonly experience: number

  /**
   * Resourses amount.
   */
  readonly resources: number

  /**
   * Health management.
   */
  readonly live: ILive

  /**
   * Add additional features.
   * @param type = Feature type
   */
  addFeature(type: PlayerFeature): void

  /**
   * Get experience amount for specified level.
   * @param offset - Level offset
   */
  getNextExperience(offset?: number): number

  /**
   * Inremeting number of killed enemies.
   */
  incrementKills(): void

  /**
   * Give player experience.
   * If enough experience, the level will be increased.
   * @param amount - Amount
   */
  giveExperience(amount: number): void

  /**
   * Give player resources.
   * @param amount - Resources amount
   */
  giveResources(amount: number): void

  /**
   * Take player resources.
   * @param amount - Resources amount
   */
  takeResources(amount: number): void
}

export enum PlayerTexture {
  PLAYER = 'player',
}

export enum PlayerAudio {
  LEVEL_UP = 'player/level_up',
  MOVE = 'player/move',
  DEAD = 'player/dead',
}

export enum PlayerFeature {
  TOTAL_FROST = 'TOTAL_FROST',
  MASS_RELOAD = 'MASS_RELOAD',
  RESPAWN_ASSISTANT = 'RESPAWN_ASSISTANT',
}

export enum MovementDirection {
  LEFT = -1,
  RIGHT = 1,
  UP = -1,
  DOWN = 1,
  NONE = 0,
}

export type PlayerData = {
  positionAtMatrix: Vector2D
};

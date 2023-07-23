import { AssistantTexture } from '~type/world/entities/npc/assistant';
import { EnemyTexture } from '~type/world/entities/npc/enemy';
import { ISprite } from '~type/world/entities/sprite';
import { Vector2D } from '~type/world/level';

export interface INPC extends ISprite {
  /**
   * State of finded path.
   */
  isPathPassed: boolean

  /**
   * Pause NPC actions.
   * @param duration - Pause duration
   * @param effects - Use effects
   */
  freeze(duration: number, effects?: boolean): void

  /**
   * Check is NPC actions is paused.
   */
  isFreezed(): boolean

  /**
   * Find new path to target.
   */
  findPathToTarget(): void

  /**
   * Get distance to target.
   */
  getDistanceToTarget(): number

  /**
   * Move NPC to position.
   * @param position - Position at world
   */
  moveTo(position: Vector2D): void
}

export type NPCData = {
  positionAtMatrix: Vector2D
  texture: EnemyTexture | AssistantTexture
  speed: number
  health: number
  pathFindTriggerDistance: number
  frameRate?: number
};

import { AssistantTexture } from '~type/world/entities/npc/assistant';
import { EnemyTexture } from '~type/world/entities/npc/enemy';
import { ISprite, SpriteBodyData } from '~type/world/entities/sprite';
import { Vector2D } from '~type/world/level';

export interface INPC extends ISprite {
  /**
   * State of finded path.
   */
  isPathPassed: boolean

  /**
   * Slow down and stop actions.
   * @param duration - Pause duration
   * @param effects - Use effects
   */
  freeze(duration: number, effects?: boolean): void

  /**
   * Check is NPC actions is paused.
   * @param withEffects - Effects state
   */
  isFreezed(withEffects?: boolean): boolean

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

export enum NPCEvent {
  PATH_NOT_FOUND = 'path_not_found',
}

export type NPCData = {
  positionAtMatrix?: Vector2D
  positionAtWorld?: Vector2D
  texture: EnemyTexture | AssistantTexture
  speed: number
  health?: number
  pathFindTriggerDistance: number
  body: SpriteBodyData
};

import { AssistantTexture } from '~type/world/entities/npc/assistant';
import { EnemyTexture } from '~type/world/entities/npc/enemy';
import { ISprite } from '~type/world/entities/sprite';
import { Vector2D } from '~type/world/level';

export interface INPC extends ISprite {
  /**
   * Damage amount.
   */
  damage: Nullable<number>

  /**
   * Maximum speed.
   */
  speed: number

  /**
   * State of finded path.
   */
  isPathPassed: boolean

  /**
   * Pause NPC pursuit and attacks.
   * @param duration - Pause duration
   */
  calmDown(duration: number): void

  /**
   * Check is NPC pursuit and attacks is paused.
   */
  isCalmed(): boolean

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
  damage?: Nullable<number>
  health: number
  pathFindTriggerDistance: number
  frameRate?: number
};

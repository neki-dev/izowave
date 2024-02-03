import { PositionAtWorld, PositionAtMatrix } from '~scene/world/level/types';

import { AssistantTexture } from './assistant/types';
import { EnemyTexture } from './enemy/types';
import { ISprite, SpriteBodyData } from '../types';

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
   * Move NPC to position.
   * @param position - Position at world
   */
  moveTo(position: PositionAtWorld): void
}

export type NPCData = {
  positionAtMatrix?: PositionAtMatrix
  positionAtWorld?: PositionAtWorld
  texture: EnemyTexture | AssistantTexture
  speed: number
  health?: number
  pathFindTriggerDistance: number
  seesInvisibleTarget: boolean
  body: SpriteBodyData
  customAnimation?: boolean
};

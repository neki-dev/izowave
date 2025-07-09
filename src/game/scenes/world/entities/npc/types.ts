import type { SpriteBodyData } from '../types';

import type { AssistantTexture } from './assistant/types';
import type { EnemyTexture } from './enemy/types';

import type { PositionAtWorld, PositionAtMatrix } from '~scene/world/level/types';

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

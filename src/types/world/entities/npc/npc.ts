import { AssistantTexture } from '~type/world/entities/npc/assistant';
import { EnemyTexture } from '~type/world/entities/npc/enemy';
import { Vector2D } from '~type/world/level';

export type NPCData = {
  positionAtMatrix: Vector2D
  texture: EnemyTexture | AssistantTexture
  speed: number
  damage?: Nullable<number>
  health: number
  pathBreakpoint: number
  frameRate?: number
};

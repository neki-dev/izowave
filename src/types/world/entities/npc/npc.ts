import Phaser from 'phaser';

import { AssistantTexture } from '~type/world/entities/npc/assistant';
import { EnemyTexture } from '~type/world/entities/npc/enemy';

export type NPCData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  texture: EnemyTexture | AssistantTexture
  speed: number
  damage?: number
  health: number
  pathBreakpoint: number
  frameRate?: number
};

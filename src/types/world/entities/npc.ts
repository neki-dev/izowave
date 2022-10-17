import Phaser from 'phaser';
import { AssistantTexture } from '~type/world/entities/assistant';
import { EnemyTexture } from '~type/world/entities/enemy';

export type NPCData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  texture: EnemyTexture | AssistantTexture
  speed: number
  damage?: number
  health: number
  pathBreakpoint: number
  frameRate?: number
};

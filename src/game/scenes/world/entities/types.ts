import type { PositionAtMatrix, PositionAtWorld } from '../level/types';

import type { IndicatorData } from './addons/indicator/types';

export type SpriteBodyData = {
  type: 'rect' | 'circle'
  width: number
  height: number
  gamut: number
};

export type SpriteData = {
  texture: string
  positionAtMatrix?: PositionAtMatrix
  positionAtWorld?: PositionAtWorld
  frame?: number
  health?: number
  speed: number
  body: SpriteBodyData
};

export type SpriteIndicatorData = Omit<IndicatorData, 'size'> & {
  value: () => number
};

export enum EntityType {
  BUILDING = 'BUILDING',
  NPC = 'NPC',
  ENEMY = 'ENEMY',
  SHOT = 'SHOT',
  CRYSTAL = 'CRYSTAL',
  SPRITE = 'SPRITE',
}

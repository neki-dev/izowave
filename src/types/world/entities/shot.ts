import { BuildingTower } from '~entity/building/variants/tower';
import { Assistant } from '~entity/npc/variants/assistant';

export enum ShotType {
  BALL = 'BALL',
  LAZER = 'LAZER',
}

export enum ShotTexture {
  FIRE = 'shot/fire',
  FROZEN = 'shot/frozen',
}

export enum ShotAudio {
  BALL_FIRE = 'shot/ball_fire',
  BALL_FROZEN = 'shot/ball_frozen',
  LAZER = 'shot/lazer',
}

export type ShotParams = {
  speed?: number
  maxDistance: number
  damage?: number
  freeze?: number
};

export type ShotData = {
  texture: ShotTexture
  audio: ShotAudio
  glowColor?: number
};

export type ShotParent = BuildingTower | Assistant;

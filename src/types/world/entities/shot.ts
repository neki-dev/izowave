import { BuildingTower } from '~game/scenes/world/entities/building/variants/tower';
import { Assistant } from '~game/scenes/world/entities/npc/variants/assistant';
import { ShotBallFire } from '~game/scenes/world/entities/shot/ball/variants/fire';
import { ShotBallFrozen } from '~game/scenes/world/entities/shot/ball/variants/frozen';
import { ShotLazer } from '~game/scenes/world/entities/shot/lazer';

export type ShotInstance = typeof ShotLazer | typeof ShotBallFire | typeof ShotBallFrozen;

export enum ShotLazerAudio {
  LAZER = 'shot/lazer',
}

export enum ShotBallTexture {
  FIRE = 'shot/fire',
  FROZEN = 'shot/frozen',
}

export enum ShotBallAudio {
  FIRE = 'shot/ball_fire',
  FROZEN = 'shot/ball_frozen',
}

export type ShotBallData = {
  texture: ShotBallTexture
  audio: ShotBallAudio
  glowColor?: number
};

export type ShotParams = {
  speed?: number
  maxDistance: number
  damage?: number
  freeze?: number
};

export type ShotParent = BuildingTower | Assistant;

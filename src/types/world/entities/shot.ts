import { BuildingTower } from '~entity/building/variants/tower';
import { Assistant } from '~entity/npc/variants/assistant';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { ShotBallFrozen } from '~entity/shot/ball/variants/frozen';
import { ShotLazer } from '~entity/shot/lazer';

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

import { Enemy } from '~entity/npc/variants/enemy';
import { World } from '~scene/world';

export interface IShot {
  params: ShotParams
  setInitiator(parent: IShotInitiator): void
  shoot(target: Enemy): void
}

export interface IShotInitiator {
  readonly scene: World
  x: number
  y: number
  visible: boolean
  on(event: string, callback: () => void): void
}

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

export type ShotParams = {
  speed?: number
  maxDistance?: number
  damage?: number
  freeze?: number
};

export type ShotBallData = {
  texture: ShotBallTexture
  audio: ShotBallAudio
  glowColor?: number
};

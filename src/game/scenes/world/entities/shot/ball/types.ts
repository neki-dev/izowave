import type { ShotData } from '../types';

export enum ShotBallAudio {
  FIRE = 'shot/ball_fire',
  FROZEN = 'shot/ball_frozen',
  SIMPLE = 'shot/ball_simple',
}

export type ShotBallData = ShotData & {
  audio: ShotBallAudio
  color: number
  glow?: boolean
};

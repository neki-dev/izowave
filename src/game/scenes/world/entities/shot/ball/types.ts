import type { ShotData } from '../types';

export enum ShotBallAudio {
  FIRE = 'ShotBallAudio:FIRE',
  FROZEN = 'ShotBallAudio:FROZEN',
  SIMPLE = 'ShotBallAudio:SIMPLE',
}

export type ShotBallData = ShotData & {
  audio: ShotBallAudio
  color: number
  glow?: boolean
};

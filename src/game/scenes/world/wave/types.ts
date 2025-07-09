export enum WaveEvent {
  START = 'start',
  COMPLETE = 'complete',
}

export enum WaveAudio {
  START = 'wave/start',
  COMPLETE = 'wave/complete',
  TICK = 'wave/tick',
}

export type WaveSavePayload = {
  number: number
  timeleft: number
};

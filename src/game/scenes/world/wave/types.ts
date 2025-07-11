export enum WaveEvent {
  START = 'start',
  COMPLETE = 'complete',
}

export enum WaveAudio {
  START = 'WaveAudio:START',
  COMPLETE = 'WaveAudio:COMPLETE',
  TICK = 'WaveAudio:TICK',
}

export type WaveSavePayload = {
  number: number
  timeleft: number
};

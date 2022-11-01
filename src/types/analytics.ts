declare global {
  interface Window {
    dataLayer: any[]
  }
}

export enum AnalyticEvent {
  GAME_START = 'GAME_START',
  GAME_FINISH = 'GAME_FINISH',
  WAVE_START = 'WAVE_START',
  WAVE_COMPLETE = 'WAVE_COMPLETE',
}

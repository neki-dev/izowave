declare global {
  interface Window {
    dataLayer: any[]
  }
}

export enum AnalyticEvent {
  GAME_FINISH = 'GAME_FINISH',
  WAVE_COMPLETE = 'WAVE_COMPLETE',
}

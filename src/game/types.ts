import type { Game } from '.';

import type { TutorialStep, TutorialStepState } from '~core/tutorial/types';

export enum GameScene {
  SYSTEM = 'SYSTEM',
  WORLD = 'WORLD',
  SCREEN = 'SCREEN',
  MENU = 'MENU',
}

export enum GameEvent {
  CHANGE_STATE = 'change_state',
  START = 'start',
  FINISH = 'finish',
  UPDATE_SETTINGS = 'update_settings',
  TOGGLE_PAUSE = 'toggle_pause',
}

export enum GameState {
  IDLE = 'IDLE',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  PAUSED = 'PAUSED',
}

export enum GameSettings {
  AUDIO = 'AUDIO',
  SHOW_DAMAGE = 'SHOW_DAMAGE',
  EFFECTS = 'EFFECTS',
  TUTORIAL = 'TUTORIAL',
}

export enum GameDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export type GameSavePayload = {
  difficulty: GameDifficulty
  tutorial: Partial<Record<TutorialStep, TutorialStepState>>
};

export type GameStat = {
  score: number
  waves: number
  kills: number
  lived: number
};

declare global {
  interface Window {
    GAME?: Game
  }
}

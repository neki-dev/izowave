import Phaser from 'phaser';

import { IAnalytics } from '~type/analytics';
import { IScreen } from '~type/screen';
import { ITutorial } from '~type/tutorial';
import { IWorld } from '~type/world';

export interface IGame extends Phaser.Game {
  /**
   * World scene.
   */
  readonly world: IWorld

  /**
   * Screen scene.
   */
  readonly screen: IScreen

  /**
   * Game is paused.
   */
  readonly onPause: boolean

  /**
   * Game is finished.
   */
  readonly isFinished: boolean

  /**
   * Game is started.
   */
  readonly isStarted: boolean

  /**
   * Analytics manager.
   */
  readonly analytics: IAnalytics

  /**
   * Tutorial manager.
   */
  readonly tutorial: ITutorial

  /**
   * Game settings.
   */
  readonly settings: Partial<Record<GameSettings, string>>

  /**
   * Game difficulty.
   */
  difficulty: GameDifficulty

  /**
   * Pause game.
   */
  pauseGame(): void

  /**
   * Resume game.
   */
  resumeGame(): void

  /**
   * Start new game.
   */
  startNewGame(): void

  /**
   * Stop game.
   */
  stopGame(): void

  /**
   * Finish game.
   */
  finishGame(): void

  /**
   * Get difficylty multiplier by settings.
   */
  getDifficultyMultiplier(): number

  /**
   * Set game settings value.
   * @param key - Settings key
   * @param value - New value
   */
  updateSetting(key: GameSettings, value: string): void

  /**
   * Check is setting enabled.
   * @param key - Settings key
   */
  isSettingEnabled(key: GameSettings): boolean

  /**
   * Check is flag enabled.
   * @param key - Flag key
   */
  isFlagEnabled(key: GameFlag): boolean

  /**
   * Show game ad.
   * @param type - Ad type
   * @param callback - Complete callback
   */
  showAd(type: GameAdType, callback?: () => void): void
}

export enum GameAdType {
  MIDGAME = 'midgame',
  REWARDED = 'rewarded',
}

export enum GameScene {
  SYSTEM = 'SYSTEM',
  GAMEOVER = 'GAMEOVER',
  WORLD = 'WORLD',
  SCREEN = 'SCREEN',
  MENU = 'MENU',
}

export enum GameEvents {
  START = 'start',
  FINISH = 'finish',
  UPDATE_SETTINGS = 'update_settings',
}

export enum GameSettings {
  AUDIO = 'AUDIO',
  EFFECTS = 'EFFECTS',
  TUTORIAL = 'TUTORIAL',
}

export enum GameDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export enum GameFlag {
  NO_BLOOD = 'NO_BLOOD',
  ADS = 'ADS',
}

export type GameSettingsData = {
  description: string
  values: string[]
  default: string
};

export type GameStat = {
  score: number
  waves: number
  kills: number
  lived: number
};

declare global {
  const IS_DEV_MODE: boolean;

  interface Window {
    GAME: IGame
  }
}

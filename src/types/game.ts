import Phaser from 'phaser';

import { IAnalytics } from '~type/analytics';
import { IMenu } from '~type/menu';
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
   * Menu scene.
   */
  readonly menu: IMenu

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
  startGame(): void

  /**
   * Stop game.
   */
  stopGame(): void

  /**
   * Restart game.
   */
  restartGame(): void

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
}

export interface IScene extends Phaser.Scene {
  readonly game: IGame
}

export enum GameScene {
  BASIC = 'BASIC',
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
  DIFFICULTY = 'DIFFICULTY',
  AUDIO = 'AUDIO',
  EFFECTS = 'EFFECTS',
  TUTORIAL = 'TUTORIAL',
}

export type GameSettingsData = {
  description: string
  values: string[]
  default: string
  runtime: boolean
};

export type GameStat = {
  waves: number
  kills: number
  lived: number
};

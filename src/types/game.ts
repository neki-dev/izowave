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
   * Game difficulty type.
   */
  readonly difficultyType: GameDifficulty

  /**
   * Game difficulty multiply.
   */
  readonly difficulty: number

  /**
   * Game is paused.
   */
  readonly isPaused: boolean

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
   * Set game difficulty.
   * @param type - Difficulty type
   */
  setDifficulty(type: GameDifficulty): void
}

export interface IScene extends Phaser.Scene {
  readonly game: IGame
}

export enum SceneKey {
  BASIC = 'BASIC',
  GAMEOVER = 'GAMEOVER',
  WORLD = 'WORLD',
  SCREEN = 'SCREEN',
  MENU = 'MENU',
}

export enum GameEvents {
  START = 'start',
  FINISH = 'finish',
}

export enum GameDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export type GameDifficultyPowers = Record<GameDifficulty, number>;

export type GameStat = {
  waves: number
  kills: number
  level: number
  lived: number
};

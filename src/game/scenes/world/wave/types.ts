import type { IWorld } from '../types';
import type Phaser from 'phaser';

export interface IWave extends Phaser.Events.EventEmitter {
  readonly scene: IWorld

  /**
   * State of wave starting.
   */
  readonly isGoing: boolean

  /**
   * Current wave number.
   */
  readonly number: number

  /**
   * Mod that stops start of wave.
   * Used for test.
   */
  readonly isPeaceMode: boolean

  /**
   * Destroy wave.
   */
  destroy(): void

  /**
   * Update wave process.
   */
  update(): void

  /**
   * Set timeleft by current wave number.
   */
  runTimeleft(): void

  /**
   * Get timeleft to next wave.
   */
  getTimeleft(): number

  /**
   * Get count of enemies left.
   */
  getEnemiesLeft(): number

  /**
   * Skip timeleft to next wave.
   */
  skipTimeleft(): void

  /**
   * Get data for saving.
   */
  getSavePayload(): WaveSavePayload

  /**
   * Load saved data.
   * @param data - Data
   */
  loadSavePayload(data: WaveSavePayload): void
}

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

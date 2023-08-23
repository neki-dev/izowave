import EventEmitter from 'events';

import { IWorld } from '~type/world';

export interface IWave extends EventEmitter {
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

export enum WaveEvents {
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

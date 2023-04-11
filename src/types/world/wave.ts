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
   * Used for cheats and tests.
   */
  readonly isPeaceMode: boolean

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
   * Skip spawn enemies.
   */
  skipEnemies(): void

  /**
   * Get season.
   */
  getSeason(): number
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

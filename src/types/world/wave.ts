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
  number: number

  /**
   * Mod that stops start of wave.
   * Used for cheats and tests.
   */
  isPeaceMode: boolean

  /**
   * Update wave process.
   */
  update(): void

  /**
   * Get timeleft to next wave.
   */
  getTimeleft(): number

  /**
   * Start timeleft to next wave.
   */
  runTimeleft(): void

  /**
   * Get count of enemies left.
   */
  getEnemiesLeft(): number

  /**
   * Skip spawn enemies.
   */
  skipEnemies(): void
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

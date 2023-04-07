import EventEmmiter from 'events';

export interface ILive extends EventEmmiter {
  /**
   * Health amount.
   */
  readonly health: number

  /**
   * Maximum health amount.
   */
  readonly maxHealth: number

  /**
   * Give entity damage.
   * @param amount - Damage amount
   */
  damage(amount: number): void

  /**
   * Kill entity.
   */
  kill(): void

  /**
   * Set current health amount to maximum.
   */
  heal(): void

  /**
   * Set current health amount.
   * @param amount - Health amount
   */
  setHealth(amount: number): void

  /**
   * Set maximum health amount.
   * @param amount - Health amount
   */
  setMaxHealth(amount: number): void

  /**
   * Check is entity have full health.
   */
  isMaxHealth(): boolean

  /**
   * Check is entity dead.
   */
  isDead(): boolean
}

export enum LiveEvents {
  DEAD = 'dead',
  DAMAGE = 'damage',
}

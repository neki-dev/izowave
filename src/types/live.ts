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
   * Armour amount.
   */
  readonly armour: number

  /**
   * Maximum armour amount.
   */
  readonly maxArmour: number

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
   * Add current health amount.
   * @param amount - Health amount
   */
  addHealth(amount: number): void

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
   * Set current armour amount.
   * @param amount - Armour amount
   */
  setArmour(amount: number): void

  /**
   * Set maximum armour amount.
   * @param amount - Armour amount
   */
  setMaxArmour(amount: number): void

  /**
   * Check is entity dead.
   */
  isDead(): boolean
}

export enum LiveEvents {
  DEAD = 'dead',
  DAMAGE = 'damage',
}

export type LiveData = {
  health: number
  maxHealth?: number
  armour?: number
  maxArmour?: number
};

import EventEmmiter from 'events';

import { LiveEvents } from '~type/world/entities/live';

export class Live extends EventEmmiter {
  /**
   * Health amount.
   */
  private _health: number;

  public get health() { return this._health; }

  private set health(v) { this._health = v; }

  /**
   * Maximum health amount.
   */
  private _maxHealth: number;

  public get maxHealth() { return this._maxHealth; }

  private set maxHealth(v) { this._maxHealth = v; }

  /**
   * Live constructor.
   */
  constructor(health: number, maxHealth: number = health) {
    super();

    this.health = health;
    this.maxHealth = maxHealth;
  }

  /**
   * Give entity damage.
   *
   * @param amount - Damage amount
   */
  public damage(amount: number) {
    this.setHealth(this.health - amount);
  }

  /**
   * Kill entity.
   */
  public kill() {
    this.setHealth(0);
  }

  /**
   * Set current health amount to maximum.
   */
  public heal() {
    this.setHealth(this.maxHealth);
  }

  /**
   * Set current health amount.
   *
   * @param amount - Health amount
   */
  public setHealth(amount: number) {
    const prevHealth = this.health;

    this.health = Math.min(this.maxHealth, Math.max(0, amount));

    if (this.health === prevHealth) {
      return;
    }

    this.emit(LiveEvents.UPDATE_HEALTH, this.health - prevHealth);

    if (this.health < prevHealth) {
      this.emit(LiveEvents.DAMAGE);

      if (this.health === 0) {
        this.emit(LiveEvents.DEAD);
      }
    }
  }

  /**
   * Set maximum health amount.
   *
   * @param amount - Health amount
   */
  public setMaxHealth(amount: number) {
    this.maxHealth = Math.max(1, amount);
  }

  /**
   * Check if current health amount is maximum.
   */
  public isMaxHealth(): boolean {
    return (this.health === this.maxHealth);
  }

  /**
   * Check is dead.
   */
  public isDead(): boolean {
    return (this.health === 0);
  }
}

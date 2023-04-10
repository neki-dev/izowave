import EventEmmiter from 'events';

import { ILive, LiveEvents } from '~type/world/entities/live';

export class Live extends EventEmmiter implements ILive {
  private _health: number;

  public get health() { return this._health; }

  private set health(v) { this._health = v; }

  private _maxHealth: number;

  public get maxHealth() { return this._maxHealth; }

  private set maxHealth(v) { this._maxHealth = v; }

  constructor(health: number, maxHealth: number = health) {
    super();

    this.health = health;
    this.maxHealth = maxHealth;
  }

  public damage(amount: number) {
    this.setHealth(this.health - amount);
  }

  public kill() {
    this.setHealth(0);
  }

  public heal() {
    this.setHealth(this.maxHealth);
  }

  public addHealth(amount: number) {
    this.setHealth(this.health + amount);
  }

  public setHealth(amount: number) {
    const prevHealth = this.health;

    this.health = Math.min(this.maxHealth, Math.max(0, amount));

    if (this.health === prevHealth) {
      return;
    }

    if (this.health < prevHealth) {
      this.emit(LiveEvents.DAMAGE);

      if (this.health === 0) {
        this.emit(LiveEvents.DEAD);
      }
    }
  }

  public setMaxHealth(amount: number) {
    this.maxHealth = Math.max(1, amount);
  }

  public isMaxHealth() {
    return (this.health === this.maxHealth);
  }

  public isDead() {
    return (this.health === 0);
  }
}

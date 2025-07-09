import Phaser from 'phaser';

import { LiveEvent } from './types';
import type { LiveData } from './types';

export class Live extends Phaser.Events.EventEmitter {
  private _health: number;
  public get health() { return this._health; }
  private set health(v) { this._health = v; }

  private _maxHealth: number;
  public get maxHealth() { return this._maxHealth; }
  private set maxHealth(v) { this._maxHealth = v; }

  private _armour: number;
  public get armour() { return this._armour; }
  private set armour(v) { this._armour = v; }

  private _maxArmour: number;
  public get maxArmour() { return this._maxArmour; }
  private set maxArmour(v) { this._maxArmour = v; }

  constructor({
    health, maxHealth, armour, maxArmour,
  }: LiveData) {
    super();

    this.health = health;
    this.maxHealth = maxHealth ?? health;

    this.armour = armour ?? 0;
    this.maxArmour = maxArmour ?? armour ?? 0;
  }

  public destroy() {
    this.removeAllListeners();
  }

  public damage(amount: number) {
    if (this.isDead()) {
      return;
    }

    const normalAmount = Math.ceil(amount);
    let leftAmount = normalAmount;

    if (this.armour > 0) {
      leftAmount -= this.armour;

      this.setArmour(this.armour - normalAmount);

      if (leftAmount <= 0) {
        return;
      }
    }

    this.setHealth(this.health - leftAmount);

    this.emit(LiveEvent.DAMAGE, leftAmount);

    if (this.isDead()) {
      this.emit(LiveEvent.DEAD);
    }
  }

  public kill() {
    if (this.isDead()) {
      return;
    }

    this.health = 0;

    this.emit(LiveEvent.DEAD);
    this.emit(LiveEvent.UPDATE_HEALTH, 0);
  }

  public heal(amount?: number) {
    if (this.isMaxHealth() || (amount && amount <= 0)) {
      return;
    }

    if (amount) {
      this.addHealth(amount);
    } else {
      this.setHealth(this.maxHealth);
    }

    this.emit(LiveEvent.HEAL);
  }

  public addHealth(amount: number) {
    if (amount <= 0) {
      return;
    }

    this.setHealth(this.health + amount);
  }

  public setHealth(amount: number) {
    if (this.isDead()) {
      return;
    }

    this.health = Math.min(this.maxHealth, Math.max(0, amount));

    this.emit(LiveEvent.UPDATE_HEALTH, this.health);
  }

  public setArmour(amount: number) {
    if (this.isDead()) {
      return;
    }

    this.armour = Math.min(this.maxArmour, Math.max(0, amount));
  }

  public setMaxHealth(amount: number) {
    this.maxHealth = Math.max(1, amount);

    this.emit(LiveEvent.UPDATE_MAX_HEALTH, this.maxHealth);
  }

  public isMaxHealth() {
    return (this.health === this.maxHealth);
  }

  public setMaxArmour(amount: number) {
    this.maxArmour = Math.max(1, amount);
  }

  public isDead() {
    return (this.health === 0);
  }
}

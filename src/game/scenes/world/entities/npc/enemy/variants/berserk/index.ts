import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import { ENEMY_BERSERK_HEAL_MULTIPLIER, ENEMY_BERSERK_HEAL_TIMESTAMP_PAUSE } from './const';

import type { WorldScene } from '~scene/world';

export class EnemyBerserk extends Enemy {
  static SpawnWaveRange = [16];

  private healTimestamp: number = 0;

  private healAmount: number = 0;

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BERSERK,
      multipliers: {
        health: 2.0,
        damage: 1.0,
        speed: 0.7,
        might: 1.7,
      },
    });

    this.healAmount = Math.ceil(this.live.maxHealth * ENEMY_BERSERK_HEAL_MULTIPLIER);
  }

  public update() {
    super.update();

    try {
      this.heal();
    } catch (error) {
      console.warn('Failed to update berserk enemy', error as TypeError);
    }
  }

  private heal() {
    if (
      this.scene.player.live.isDead()
      || this.live.isDead()
      || this.live.isMaxHealth()
    ) {
      return;
    }

    const now = this.scene.getTime();

    if (now >= this.healTimestamp) {
      this.healTimestamp = now + ENEMY_BERSERK_HEAL_TIMESTAMP_PAUSE;

      this.live.heal(this.healAmount);
    }
  }
}

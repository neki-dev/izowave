import { ENEMY_HEAL_MULTIPLIER, ENEMY_HEAL_TIMESTAMP_PAUSE } from '~const/world/entities/enemy';
import { IWorld } from '~type/world';
import { EnemyVariantData, EnemyTexture } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyBerserk extends Enemy {
  static SpawnWaveRange = [16];

  private healTimestamp: number = 0;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BERSERK,
      multipliers: {
        health: 2.0,
        damage: 0.8,
        speed: 0.7,
      },
    });
  }

  public update() {
    this.heal();
    super.update();
  }

  private heal() {
    if (this.live.isDead() || this.live.isMaxHealth()) {
      return;
    }

    const now = this.scene.getTime();

    if (now >= this.healTimestamp) {
      this.healTimestamp = now + ENEMY_HEAL_TIMESTAMP_PAUSE;

      this.live.addHealth(this.live.maxHealth * ENEMY_HEAL_MULTIPLIER);
    }
  }
}

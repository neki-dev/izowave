import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import { ENEMY_TELEPATH_REGENERATION_RADIUS, ENEMY_TELEPATH_REGENERATION_EFFECT_DURATION, ENEMY_TELEPATH_REGENERATION_EFFECT_COLOR } from './const';

import { getIsometricDistance } from '~core/dimension';
import type { WorldScene } from '~scene/world';
import { EntityType } from '~scene/world/entities/types';
import { LEVEL_MAP_PERSPECTIVE } from '~scene/world/level/const';

export class EnemyTelepath extends Enemy {
  static SpawnWaveRange = [13];

  private regenerateArea: Phaser.GameObjects.Ellipse;

  private regenerateTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.TELEPATH,
      multipliers: {
        health: 1.5,
        damage: 1.0,
        speed: 0.8,
        might: 1.6,
      },
    });

    this.addArea();

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeArea();
      if (this.regenerateTimer) {
        this.scene.removeProgression(this.regenerateTimer);
      }
    });
  }

  public update() {
    super.update();

    try {
      this.updateArea();
    } catch (error) {
      console.warn('Failed to update telepth enemy', error as TypeError);
    }
  }

  private updateArea() {
    if (!this.regenerateArea.visible) {
      return;
    }

    const position = this.getBottomEdgePosition();

    this.regenerateArea.setPosition(position.x, position.y);
  }

  protected onDamage(amount: number) {
    this.healNearbyEnemies(amount);
    super.onDamage(amount);
  }

  private healNearbyEnemies(amount: number) {
    const position = this.getBottomEdgePosition();
    const enemies: Enemy[] = [];

    this.scene.getEntities<Enemy>(EntityType.ENEMY).forEach((enemy) => {
      if (!(enemy instanceof EnemyTelepath) && !enemy.live.isMaxHealth()) {
        const distance = getIsometricDistance(position, enemy.getBottomEdgePosition());

        if (distance <= ENEMY_TELEPATH_REGENERATION_RADIUS) {
          enemies.push(enemy);
        }
      }
    });

    if (enemies.length > 0) {
      if (this.regenerateTimer) {
        this.scene.removeProgression(this.regenerateTimer);
      } else {
        this.regenerateArea.setVisible(true);
      }

      this.regenerateTimer = this.scene.addProgression({
        duration: ENEMY_TELEPATH_REGENERATION_EFFECT_DURATION,
        onComplete: () => {
          this.regenerateTimer = null;
          this.regenerateArea.setVisible(false);
        },
      });

      enemies.forEach((enemy) => {
        const healthAmount = Math.floor(amount / enemies.length);

        enemy.live.heal(healthAmount);
      });
    }
  }

  private addArea() {
    const d = ENEMY_TELEPATH_REGENERATION_RADIUS * 2;

    this.regenerateArea = this.scene.add.ellipse(0, 0, d, d * LEVEL_MAP_PERSPECTIVE);
    this.regenerateArea.setVisible(false);
    this.regenerateArea.setFillStyle(ENEMY_TELEPATH_REGENERATION_EFFECT_COLOR, 0.33);
  }

  private removeArea() {
    this.regenerateArea.destroy();
  }
}

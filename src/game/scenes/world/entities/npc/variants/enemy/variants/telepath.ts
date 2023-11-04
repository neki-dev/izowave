import {
  ENEMY_REGENERATION_EFFECT_COLOR, ENEMY_REGENERATION_EFFECT_DURATION, ENEMY_REGENERATION_RADIUS,
} from '~const/world/entities/enemy';
import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { Analytics } from '~lib/analytics';
import { getIsometricDistance } from '~lib/dimension';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { EnemyVariantData, EnemyTexture, IEnemy } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

export class EnemyTelepath extends Enemy {
  static SpawnWaveRange = [13];

  private regenerateArea: Phaser.GameObjects.Ellipse;

  private regenerateTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld, data: EnemyVariantData) {
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
      Analytics.TrackWarn('Failed telepth enemy update', error as TypeError);
    }
  }

  private updateArea() {
    if (!this.regenerateArea.visible) {
      return;
    }

    const position = this.getBottomFace();

    this.regenerateArea.setPosition(position.x, position.y);
  }

  public onDamage(amount: number) {
    this.healNearbyEnemies(amount);
    super.onDamage(amount);
  }

  private healNearbyEnemies(amount: number) {
    const position = this.getBottomFace();
    const enemies: IEnemy[] = [];

    this.scene.getEntities<IEnemy>(EntityType.ENEMY).forEach((enemy) => {
      if (!(enemy instanceof EnemyTelepath) && !enemy.live.isMaxHealth()) {
        const distance = getIsometricDistance(position, enemy.getBottomFace());

        if (distance <= ENEMY_REGENERATION_RADIUS) {
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
        duration: ENEMY_REGENERATION_EFFECT_DURATION,
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
    const d = ENEMY_REGENERATION_RADIUS * 2;

    this.regenerateArea = this.scene.add.ellipse(0, 0, d, d * LEVEL_MAP_PERSPECTIVE);
    this.regenerateArea.setVisible(false);
    this.regenerateArea.setFillStyle(ENEMY_REGENERATION_EFFECT_COLOR, 0.33);
  }

  private removeArea() {
    this.regenerateArea.destroy();
  }
}

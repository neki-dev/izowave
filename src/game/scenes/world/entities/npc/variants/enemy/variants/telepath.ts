import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { getIsometricDistance } from '~lib/dimension';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { EnemyVariantData, EnemyTexture, IEnemy } from '~type/world/entities/npc/enemy';

import { Enemy } from '../enemy';

const REGENERATION_RADIUS = 110;
const REGENERATION_HEALTH_MULTIPLIER = 0.015;
const REGENERATION_DURATION = 1000;

export class EnemyTelepath extends Enemy {
  static SpawnWaveRange = [13];

  private regenerateArea: Phaser.GameObjects.Ellipse;

  private regenerateTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.TELEPATH,
      multipliers: {
        health: 1.6,
        damage: 1.0,
        speed: 0.8,
      },
    });

    this.addArea();

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.removeArea();
      if (this.regenerateTimer) {
        this.scene.removeProgression(this.regenerateTimer);
      }
    });
  }

  public update() {
    super.update();

    if (this.regenerateArea.visible) {
      const position = this.getBottomFace();

      this.regenerateArea.setPosition(position.x, position.y);
    }
  }

  public onDamage(amount: number) {
    this.activateRegeneration();
    super.onDamage(amount);
  }

  private activateRegeneration() {
    if (this.regenerateTimer) {
      this.regenerateTimer.elapsed = 0;
    } else {
      this.regenerateArea.setVisible(true);
      this.regenerateTimer = this.scene.addProgression({
        duration: REGENERATION_DURATION,
        onProgress: () => {
          this.healNearbyEnemies();
        },
        onComplete: () => {
          this.regenerateTimer = null;
          this.regenerateArea.setVisible(false);
        },
      });
    }
  }

  private healNearbyEnemies() {
    const position = this.getBottomFace();
    const healthAmount = Math.floor(this.live.maxHealth * REGENERATION_HEALTH_MULTIPLIER);

    this.scene.getEntities<IEnemy>(EntityType.ENEMY).forEach((enemy) => {
      if (
        !(enemy instanceof EnemyTelepath)
        && !enemy.live.isMaxHealth()
      ) {
        const distance = getIsometricDistance(position, enemy.getBottomFace());

        if (distance <= REGENERATION_RADIUS) {
          enemy.live.addHealth(healthAmount);
        }
      }
    });
  }

  private addArea() {
    const d = REGENERATION_RADIUS * 2;

    this.regenerateArea = this.scene.add.ellipse(0, 0, d, d * LEVEL_MAP_PERSPECTIVE);
    this.regenerateArea.setVisible(false);
    this.regenerateArea.setFillStyle(0x6fe7e7, 0.33);
  }

  private removeArea() {
    this.regenerateArea.destroy();
  }
}

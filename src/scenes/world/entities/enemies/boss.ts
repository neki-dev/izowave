import Enemy from '~scene/world/entities/enemy';
import World from '~scene/world';
import ComponentHealthBar from '~scene/world/components/health-bar';

import { EnemyVariantData, EnemyTexture } from '~type/enemy';

export default class EnemyBoss extends Enemy {
  constructor(scene: World, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.BOSS,
      health: 700,
      damage: 90,
      speed: 24,
      experienceMultiply: 10.0,
      scale: 2.0,
    });

    this.addHealthIndicator();
  }

  /**
   * Add current health indicator above enemy.
   */
  private addHealthIndicator() {
    const bar = <Phaser.GameObjects.Container> ComponentHealthBar.call(this.scene, {
      size: [50, 8],
      live: this.live,
    });
    bar.setPosition(bar.x, -(this.displayHeight / 2 + 15));
    this.container.add(bar);
  }
}

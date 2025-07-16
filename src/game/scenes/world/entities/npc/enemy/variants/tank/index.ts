import { Enemy } from '../..';
import { EnemyTexture } from '../../types';
import type { EnemyVariantData } from '../../types';

import { ENEMY_TANK_ARMOUR, ENEMY_TANK_ARMOUR_GROWTH, ENEMY_TANK_ARMOUR_GROWTH_RETARDATION_LEVEL } from './const';

import { progressionQuadratic } from '~core/progression';
import type { WorldScene } from '~scene/world';

export class EnemyTank extends Enemy {
  static SpawnWaveRange = [6];

  constructor(scene: WorldScene, data: EnemyVariantData) {
    super(scene, {
      ...data,
      texture: EnemyTexture.TANK,
      multipliers: {
        health: 1.8,
        damage: 0.6,
        speed: 0.7,
        might: 1.5,
      },
    });

    const armour = progressionQuadratic({
      defaultValue: ENEMY_TANK_ARMOUR * scene.game.getDifficultyMultiplier(),
      scale: ENEMY_TANK_ARMOUR_GROWTH,
      level: scene.wave.number,
      retardationLevel: ENEMY_TANK_ARMOUR_GROWTH_RETARDATION_LEVEL,
    });

    this.live.setMaxArmour(armour);
    this.live.setArmour(armour);

    this.addIndicator('armour', {
      color: 0x00d4ff,
      value: () => this.live.armour / this.live.maxArmour,
      destroyIf: (value: number) => value === 0,
    });
  }
}

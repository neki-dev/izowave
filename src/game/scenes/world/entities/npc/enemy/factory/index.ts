import type { EnemyVariant, EnemyVariantData } from '../types';

import { ENEMIES } from './const';

import type { WorldScene } from '~game/scenes/world';

export class EnemyFactory {
  public static create(scene: WorldScene, variant: EnemyVariant, data: EnemyVariantData) {
    const EnemyInstance = ENEMIES[variant];

    return new EnemyInstance(scene, data);
  }
}

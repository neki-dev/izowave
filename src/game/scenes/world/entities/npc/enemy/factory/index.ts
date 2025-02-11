import type { EnemyVariant, EnemyVariantData } from '../types';

import { ENEMIES } from './const';

import type { IWorld } from '~scene/world/types';

export class EnemyFactory {
  public static create(scene: IWorld, variant: EnemyVariant, data: EnemyVariantData) {
    const EnemyInstance = ENEMIES[variant];

    return new EnemyInstance(scene, data);
  }
}

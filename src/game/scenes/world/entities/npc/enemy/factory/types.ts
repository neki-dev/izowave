import type { IWorld } from '~scene/world/types';

import type { EnemyVariantData, IEnemy } from '../types';

export interface IEnemyFactory {
  SpawnWaveRange?: number[]
  new (scene: IWorld, data: EnemyVariantData): IEnemy
}

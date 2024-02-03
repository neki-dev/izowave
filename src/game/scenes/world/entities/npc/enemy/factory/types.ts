import { IWorld } from '~scene/world/types';

import { EnemyVariantData, IEnemy } from '../types';

export interface IEnemyFactory {
  SpawnWaveRange?: number[]
  new (scene: IWorld, data: EnemyVariantData): IEnemy
}

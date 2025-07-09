import type { Enemy } from '..';
import type { EnemyVariantData } from '../types';

import type { WorldScene } from '~game/scenes/world';

export interface IEnemyFactory {
  SpawnWaveRange?: number[]
  new (scene: WorldScene, data: EnemyVariantData): Enemy
}

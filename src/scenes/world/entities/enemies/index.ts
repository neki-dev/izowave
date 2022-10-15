import { EnemyVariant } from '~type/world/entities/enemy';

import { EnemyBat } from './bat';
import { EnemyBoss } from './boss';
import { EnemyBouche } from './bouche';
import { EnemyDemon } from './demon';
import { EnemyImpure } from './impure';
import { EnemyOverlord } from './overlord';
import { EnemyUndead } from './undead';

export const ENEMIES: {
  [value in EnemyVariant]: any
} = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.OVERLORD]: EnemyOverlord,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.UNDEAD]: EnemyUndead,
  [EnemyVariant.IMPURE]: EnemyImpure,
  [EnemyVariant.BOUCHE]: EnemyBouche,
};

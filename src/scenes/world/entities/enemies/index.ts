import EnemyBat from './bat';
import EnemyDemon from './demon';
import EnemyOverlord from './overlord';
import EnemyBoss from './boss';
import EnemyUndead from './undead';
import EnemyImpure from './impure';
import EnemyBouche from './bouche';

import { EnemyVariant } from '~type/enemy';

const ENEMIES: {
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

export default ENEMIES;

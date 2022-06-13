import EnemyBat from '~scene/world/entities/enemies/bat';
import EnemyDemon from '~scene/world/entities/enemies/demon';
import EnemyOverlord from '~scene/world/entities/enemies/overlord';
import EnemyBoss from '~scene/world/entities/enemies/boss';
import EnemyUndead from '~scene/world/entities/enemies/undead';
import EnemyImpure from '~scene/world/entities/enemies/impure';
import EnemyBouche from '~scene/world/entities/enemies/bouche';

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

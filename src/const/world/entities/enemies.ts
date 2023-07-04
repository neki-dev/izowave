import { EnemyBat } from '~entity/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~entity/npc/variants/enemy/variants/boss';
import { EnemyDemon } from '~entity/npc/variants/enemy/variants/demon';
import { EnemyImpure } from '~entity/npc/variants/enemy/variants/impure';
import { EnemyOverlord } from '~entity/npc/variants/enemy/variants/overlord';
import { EnemySpike } from '~entity/npc/variants/enemy/variants/spike';
import { EnemyUndead } from '~entity/npc/variants/enemy/variants/undead';
import { EnemyVariant, IEnemyFactory } from '~type/world/entities/npc/enemy';

export const ENEMIES: Record<EnemyVariant, IEnemyFactory> = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.SPIKE]: EnemySpike,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.OVERLORD]: EnemyOverlord,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.UNDEAD]: EnemyUndead,
  [EnemyVariant.IMPURE]: EnemyImpure,
};

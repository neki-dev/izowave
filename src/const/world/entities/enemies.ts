import { EnemyBat } from '~entity/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~entity/npc/variants/enemy/variants/boss';
import { EnemyDemon } from '~entity/npc/variants/enemy/variants/demon';
import { EnemyImpure } from '~entity/npc/variants/enemy/variants/impure';
import { EnemyOverlord } from '~entity/npc/variants/enemy/variants/overlord';
import { EnemySpike } from '~entity/npc/variants/enemy/variants/spike';
import { EnemyTermer } from '~entity/npc/variants/enemy/variants/termer';
import { EnemyUndead } from '~entity/npc/variants/enemy/variants/undead';
import { EnemyVariant, IEnemyFactory } from '~type/world/entities/npc/enemy';

export const ENEMIES: Record<EnemyVariant, IEnemyFactory> = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.SPIKE]: EnemySpike,
  [EnemyVariant.OVERLORD]: EnemyOverlord,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.UNDEAD]: EnemyUndead,
  [EnemyVariant.IMPURE]: EnemyImpure,
  [EnemyVariant.TERMER]: EnemyTermer,
};

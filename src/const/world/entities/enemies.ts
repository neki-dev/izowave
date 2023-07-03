import { EnemyBat } from '~entity/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~entity/npc/variants/enemy/variants/boss';
import { EnemyDemon } from '~entity/npc/variants/enemy/variants/demon';
import { EnemyImpure } from '~entity/npc/variants/enemy/variants/impure';
import { EnemyJellyfish } from '~entity/npc/variants/enemy/variants/jellyfish';
import { EnemyOverlord } from '~entity/npc/variants/enemy/variants/overlord';
import { EnemyUndead } from '~entity/npc/variants/enemy/variants/undead';
import { EnemyVariant, IEnemyFactory } from '~type/world/entities/npc/enemy';

export const ENEMIES: Record<EnemyVariant, IEnemyFactory> = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.JELLYFISH]: EnemyJellyfish,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.OVERLORD]: EnemyOverlord,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.UNDEAD]: EnemyUndead,
  [EnemyVariant.IMPURE]: EnemyImpure,
};

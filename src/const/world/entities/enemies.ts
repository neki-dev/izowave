import { EnemyBat } from '~entity/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~entity/npc/variants/enemy/variants/boss';
import { EnemyDemon } from '~entity/npc/variants/enemy/variants/demon';
import { EnemyImpure } from '~entity/npc/variants/enemy/variants/impure';
import { EnemyOverlord } from '~entity/npc/variants/enemy/variants/overlord';
import { EnemyRisper } from '~entity/npc/variants/enemy/variants/risper';
import { EnemySpike } from '~entity/npc/variants/enemy/variants/spike';
import { EnemyTermer } from '~entity/npc/variants/enemy/variants/termer';
import { EnemyVariant, IEnemyFactory } from '~type/world/entities/npc/enemy';

export const ENEMIES: Record<EnemyVariant, IEnemyFactory> = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.RISPER]: EnemyRisper,
  [EnemyVariant.SPIKE]: EnemySpike,
  [EnemyVariant.OVERLORD]: EnemyOverlord,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.IMPURE]: EnemyImpure,
  [EnemyVariant.TERMER]: EnemyTermer,
};

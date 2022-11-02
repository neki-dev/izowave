import { EnemyBat } from '~entity/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~entity/npc/variants/enemy/variants/boss';
import { EnemyBouche } from '~entity/npc/variants/enemy/variants/bouche';
import { EnemyDemon } from '~entity/npc/variants/enemy/variants/demon';
import { EnemyImpure } from '~entity/npc/variants/enemy/variants/impure';
import { EnemyOverlord } from '~entity/npc/variants/enemy/variants/overlord';
import { EnemyUndead } from '~entity/npc/variants/enemy/variants/undead';
import { EnemyVariant } from '~type/world/entities/npc/enemy';

export const ENEMIES: Record<EnemyVariant, any> = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.OVERLORD]: EnemyOverlord,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.UNDEAD]: EnemyUndead,
  [EnemyVariant.IMPURE]: EnemyImpure,
  [EnemyVariant.BOUCHE]: EnemyBouche,
};

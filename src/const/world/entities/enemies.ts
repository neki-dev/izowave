import { EnemyBat } from '~game/scenes/world/entities/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~game/scenes/world/entities/npc/variants/enemy/variants/boss';
import { EnemyBouche } from '~game/scenes/world/entities/npc/variants/enemy/variants/bouche';
import { EnemyDemon } from '~game/scenes/world/entities/npc/variants/enemy/variants/demon';
import { EnemyImpure } from '~game/scenes/world/entities/npc/variants/enemy/variants/impure';
import { EnemyOverlord } from '~game/scenes/world/entities/npc/variants/enemy/variants/overlord';
import { EnemyUndead } from '~game/scenes/world/entities/npc/variants/enemy/variants/undead';
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

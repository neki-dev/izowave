import { EnemyAdherent } from '~entity/npc/variants/enemy/variants/adherent';
import { EnemyBat } from '~entity/npc/variants/enemy/variants/bat';
import { EnemyBoss } from '~entity/npc/variants/enemy/variants/boss';
import { EnemyDemon } from '~entity/npc/variants/enemy/variants/demon';
import { EnemyExplosive } from '~entity/npc/variants/enemy/variants/explosive';
import { EnemyGhost } from '~entity/npc/variants/enemy/variants/ghost';
import { EnemyRisper } from '~entity/npc/variants/enemy/variants/risper';
import { EnemySpike } from '~entity/npc/variants/enemy/variants/spike';
import { EnemyStranger } from '~entity/npc/variants/enemy/variants/stranger';
import { EnemyTank } from '~entity/npc/variants/enemy/variants/tank';
import { EnemyTermer } from '~entity/npc/variants/enemy/variants/termer';
import { EnemyVariant, IEnemyFactory } from '~type/world/entities/npc/enemy';

export const ENEMIES: Record<EnemyVariant, IEnemyFactory> = {
  [EnemyVariant.BAT]: EnemyBat,
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.RISPER]: EnemyRisper,
  [EnemyVariant.SPIKE]: EnemySpike,
  [EnemyVariant.TANK]: EnemyTank,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.GHOST]: EnemyGhost,
  [EnemyVariant.TERMER]: EnemyTermer,
  [EnemyVariant.EXPLOSIVE]: EnemyExplosive,
  [EnemyVariant.STRANGER]: EnemyStranger,
  [EnemyVariant.ADHERENT]: EnemyAdherent,
};

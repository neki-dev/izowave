import type { IEnemyFactory } from './types';

import { EnemyVariant } from '~scene/world/entities/npc/enemy/types';
import { EnemyAdherent } from '~scene/world/entities/npc/enemy/variants/adherent';
import { EnemyBerserk } from '~scene/world/entities/npc/enemy/variants/berserk';
import { EnemyBoss } from '~scene/world/entities/npc/enemy/variants/boss';
import { EnemyDemon } from '~scene/world/entities/npc/enemy/variants/demon';
import { EnemyExplosive } from '~scene/world/entities/npc/enemy/variants/explosive';
import { EnemyGhost } from '~scene/world/entities/npc/enemy/variants/ghost';
import { EnemyRisper } from '~scene/world/entities/npc/enemy/variants/risper';
import { EnemySpike } from '~scene/world/entities/npc/enemy/variants/spike';
import { EnemyStranger } from '~scene/world/entities/npc/enemy/variants/stranger';
import { EnemyTank } from '~scene/world/entities/npc/enemy/variants/tank';
import { EnemyTelepath } from '~scene/world/entities/npc/enemy/variants/telepath';
import { EnemyTermer } from '~scene/world/entities/npc/enemy/variants/termer';
import { EnemyUndead } from '~scene/world/entities/npc/enemy/variants/undead';

export const ENEMIES: Record<EnemyVariant, IEnemyFactory> = {
  [EnemyVariant.DEMON]: EnemyDemon,
  [EnemyVariant.UNDEAD]: EnemyUndead,
  [EnemyVariant.RISPER]: EnemyRisper,
  [EnemyVariant.SPIKE]: EnemySpike,
  [EnemyVariant.TANK]: EnemyTank,
  [EnemyVariant.BOSS]: EnemyBoss,
  [EnemyVariant.GHOST]: EnemyGhost,
  [EnemyVariant.TERMER]: EnemyTermer,
  [EnemyVariant.EXPLOSIVE]: EnemyExplosive,
  [EnemyVariant.STRANGER]: EnemyStranger,
  [EnemyVariant.ADHERENT]: EnemyAdherent,
  [EnemyVariant.TELEPATH]: EnemyTelepath,
  [EnemyVariant.BERSERK]: EnemyBerserk,
};

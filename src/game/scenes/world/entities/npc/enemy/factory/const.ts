import type { IEnemyFactory } from './types';

import { EnemyBerserk } from '~game/scenes/world/entities/npc/enemy/variants/berserk';
import { EnemyDemon } from '~game/scenes/world/entities/npc/enemy/variants/demon';
import { EnemyExplosive } from '~game/scenes/world/entities/npc/enemy/variants/explosive';
import { EnemyGhost } from '~game/scenes/world/entities/npc/enemy/variants/ghost';
import { EnemyRisper } from '~game/scenes/world/entities/npc/enemy/variants/risper';
import { EnemyStranger } from '~game/scenes/world/entities/npc/enemy/variants/stranger';
import { EnemyTank } from '~game/scenes/world/entities/npc/enemy/variants/tank';
import { EnemyTelepath } from '~game/scenes/world/entities/npc/enemy/variants/telepath';
import { EnemyTermer } from '~game/scenes/world/entities/npc/enemy/variants/termer';
import { EnemyUndead } from '~game/scenes/world/entities/npc/enemy/variants/undead';
import { EnemyVariant } from '~scene/world/entities/npc/enemy/types';
import { EnemyAdherent } from '~scene/world/entities/npc/enemy/variants/adherent';
import { EnemyBoss } from '~scene/world/entities/npc/enemy/variants/boss';
import { EnemySpike } from '~scene/world/entities/npc/enemy/variants/spike';

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

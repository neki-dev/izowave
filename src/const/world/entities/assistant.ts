import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { ShotBallSimple } from '~entity/shot/ball/variants/simple';
import { ShotLazer } from '~entity/shot/lazer';
import { AssistantVariant } from '~type/world/entities/npc/assistant';
import { IShotFactory } from '~type/world/entities/shot';

export const ASSISTANT_TILE_SIZE = {
  width: 12,
  height: 24,
  gamut: 4,
};

export const ASSISTANT_PATH_BREAKPOINT = 40;

export const ASSISTANT_WEAPON: Record<AssistantVariant, IShotFactory> = {
  [AssistantVariant.DEFAULT]: ShotBallSimple,
  [AssistantVariant.FIREBOT]: ShotBallFire,
  [AssistantVariant.LASERBOT]: ShotLazer,
};

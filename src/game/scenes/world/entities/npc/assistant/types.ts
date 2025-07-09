import type { Player } from '../../player';

import type { PositionAtMatrix } from '~scene/world/level/types';

export enum AssistantEvent {
  UNLOCK_VARIANT = 'unlock_variant',
}

export enum AssistantVariant {
  DEFAULT = 'DEFAULT',
  FIREBOT = 'FIREBOT',
  LASERBOT = 'LASERBOT',
}

export enum AssistantTexture {
  DEFAULT = 'assistant/default',
  FIREBOT = 'assistant/firebot',
  LASERBOT = 'assistant/laserbot',
}

export type AssistantData = {
  owner: Player
  positionAtMatrix: PositionAtMatrix
  speed: number
};

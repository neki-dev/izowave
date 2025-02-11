import type Phaser from 'phaser';

import type { IPlayer } from '../../player/types';
import type { IShotInitiator } from '../../shot/types';
import type { INPC } from '../types';

import type { PositionAtMatrix } from '~scene/world/level/types';

export interface IAssistant extends INPC, IShotInitiator {
  readonly body: Phaser.Physics.Arcade.Body
}

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
  owner: IPlayer
  positionAtMatrix: PositionAtMatrix
  speed: number
};

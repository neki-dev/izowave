import Phaser from 'phaser';

import { IPlayer } from '../../player/types';
import { IShotInitiator } from '../../shot/types';
import { PositionAtMatrix } from '~scene/world/level/types';

import { INPC } from '../types';

export interface IAssistant extends INPC, IShotInitiator {
  readonly body: Phaser.Physics.Arcade.Body
}

export enum AssistantEvents {
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

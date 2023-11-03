import Phaser from 'phaser';

import { INPC } from '~type/world/entities/npc';
import { IPlayer } from '~type/world/entities/player';
import { IShotInitiator } from '~type/world/entities/shot';
import { PositionAtMatrix } from '~type/world/level';

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

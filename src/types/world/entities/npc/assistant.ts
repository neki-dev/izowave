import Phaser from 'phaser';

import { INPC } from '~type/world/entities/npc';
import { IPlayer } from '~type/world/entities/player';
import { IShotInitiator } from '~type/world/entities/shot';
import { PositionAtMatrix } from '~type/world/level';

export interface IAssistant extends INPC, IShotInitiator {
  readonly body: Phaser.Physics.Arcade.Body
}

export enum AssistantTexture {
  ASSISTANT = 'assistant/assistant',
}

export type AssistantData = {
  owner: IPlayer
  positionAtMatrix: PositionAtMatrix
  speed: number
};

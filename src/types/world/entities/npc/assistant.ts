import Phaser from 'phaser';

import { INPC } from '~type/world/entities/npc';
import { IEnemyTarget } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { IShotInitiator } from '~type/world/entities/shot';
import { Vector2D } from '~type/world/level';

export interface IAssistant extends INPC, IShotInitiator, IEnemyTarget {
  readonly body: Phaser.Physics.Arcade.Body
}

export enum AssistantTexture {
  ASSISTANT = 'assistant',
}

export type AssistantData = {
  owner: IPlayer
  positionAtMatrix: Vector2D
  speed: number
};

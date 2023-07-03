import Phaser from 'phaser';

import { INPC } from '~type/world/entities/npc';
import { IEnemyTarget } from '~type/world/entities/npc/enemy';
import { IShotInitiator } from '~type/world/entities/shot';
import { Vector2D } from '~type/world/level';

import { IPlayer } from '../player';

export interface IAssistant extends INPC, IShotInitiator, IEnemyTarget {
  readonly body: Phaser.Physics.Arcade.Body

  /**
   * Upgrade level.
   */
  level: number
}

export enum AssistantTexture {
  ASSISTANT = 'assistant',
}

export enum AssistantAudio {
  DEAD = 'assistant/dead',
  DAMAGE_1 = 'assistant/damage_1',
  DAMAGE_2 = 'assistant/damage_2',
}

export type AssistantData = {
  owner: IPlayer
  positionAtMatrix: Vector2D
  speed: number
  health: number
  level: number
};

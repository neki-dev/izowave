import { INPC } from '~type/world/entities/npc';
import { IEnemyTarget } from '~type/world/entities/npc/enemy';
import { IShotInitiator } from '~type/world/entities/shot';
import { Vector2D } from '~type/world/level';

export interface IAssistant extends INPC, IShotInitiator, IEnemyTarget {
  readonly body: Phaser.Physics.Arcade.Body

  /**
   * Upgrade by level.
   * @param level - Player level
   */
  upgrade(level: number): void
}

export enum AssistantTexture {
  ASSISTANT = 'assistant',
}

export enum AssistantAudio {
  DEAD = 'assistant/dead',
}

export type AssistantData = {
  positionAtMatrix: Vector2D
};

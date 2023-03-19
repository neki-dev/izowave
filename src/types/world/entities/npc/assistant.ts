import { Vector2D } from '~type/world/level';

export enum AssistantTexture {
  ASSISTANT = 'assistant',
}

export enum AssistantAudio {
  DEAD = 'assistant/dead',
}

export type AssistantData = {
  positionAtMatrix: Vector2D
};

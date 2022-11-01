import Phaser from 'phaser';

export enum AssistantTexture {
  ASSISTANT = 'assistant',
}

export enum AssistantAudio {
  DEAD = 'assistant/dead',
}

export type AssistantData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
};

import type Phaser from 'phaser';

import type { PositionAtWorld } from '~scene/world/level/types';
import type { IWorld } from '~scene/world/types';

export interface IEffect extends Phaser.GameObjects.Sprite {
  readonly scene: IWorld
}

export enum EffectTexture {
  BLOOD = 'effect/blood',
  SMOKE = 'effect/smoke',
  DAMAGE = 'effect/damage',
  EXPLOSION = 'effect/explosion',
}

export enum EffectAudio {
  EXPLOSION = 'effect/explosion',
}

export type EffectData = {
  texture: EffectTexture
  position: PositionAtWorld
  depth?: number
  rate?: number
  staticFrame?: number
};

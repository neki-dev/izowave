import Phaser from 'phaser';

import { IWorld } from '~type/world';
import { PositionAtWorld } from '~type/world/level';

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

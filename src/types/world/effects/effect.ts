import Phaser from 'phaser';

import { IWorld } from '~type/world';
import { Vector2D } from '~type/world/level';

export interface IEffect extends Phaser.GameObjects.Sprite {
  readonly scene: IWorld
}

export enum EffectTexture {
  BLOOD = 'effect/blood',
  EXPLOSION = 'effect/explosion',
  SMOKE = 'effect/smoke',
  DAMAGE = 'effect/damage',
}

export type EffectData = {
  texture: EffectTexture
  position: Vector2D
  audio?: string
  rate?: number
  staticFrame?: number
  scale?: number
};

import type Phaser from 'phaser';

import type { WorldScene } from '../..';

import type { Particles } from '.';

import type { PositionAtWorld } from '~scene/world/level/types';

export interface IParticlesParent extends
  Phaser.GameObjects.GameObject,
  Phaser.GameObjects.Components.Transform,
  Phaser.GameObjects.Components.Depth {
  readonly scene: WorldScene
  effects?: Record<string, Particles>
}

export enum ParticlesTexture {
  BIT = 'effect/bit',
  BIT_SOFT = 'effect/bit_soft',
  GLOW = 'effect/glow',
  PLUS = 'effect/plus',
}

export type ParticlesData = {
  key: string
  position?: PositionAtWorld
  texture: ParticlesTexture
  attach?: boolean
  depth?: number
  params: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
};

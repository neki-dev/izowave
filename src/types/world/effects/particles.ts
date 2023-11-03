import Phaser from 'phaser';

import { IWorld } from '~type/world';
import { PositionAtWorld } from '~type/world/level';

export interface IParticles {
  readonly scene: IWorld

  /**
   * Particles emitter.
   */
  readonly emitter: Phaser.GameObjects.Particles.ParticleEmitter

  /**
   * Destroy emitter.
   */
  destroy(): void
}

export interface IParticlesParent extends
  Phaser.GameObjects.GameObject,
  Phaser.GameObjects.Components.Transform,
  Phaser.GameObjects.Components.Depth {
  readonly scene: IWorld

  /**
   * Record of current effects.
   */
  effects?: Record<string, IParticles>
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
  dynamic?: boolean
  params: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
};

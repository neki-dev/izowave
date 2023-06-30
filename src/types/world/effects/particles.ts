import Phaser from 'phaser';

import { IWorld } from '~type/world';

import { Vector2D } from '../level';

export interface IParticles {
  readonly scene: IWorld

  /**
   * Set emitter visible state.
   * @param state - Visible state
   */
  setVisible(state: boolean): void

  /**
   * Destroy emitter.
   */
  destroy(): void
}

export interface IParticlesParent extends Phaser.GameObjects.GameObject {
  readonly scene: IWorld

  /**
   * Record of current effects.
   */
  effects?: Partial<Record<ParticlesType, IParticles>>
}

export enum ParticlesType {
  BIT = 'BIT',
  GLOW = 'GLOW',
}

export enum ParticlesTexture {
  BIT = 'effect/bit',
  GLOW = 'effect/glow',
}

export type ParticlesData = {
  positionAtWorld?: Vector2D
  type: ParticlesType
  params: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
  duration?: number
};

import { Building } from '~entity/building';
import { ShotBall } from '~entity/shot/ball';
import { Sprite } from '~entity/sprite';
import { Particles } from '~scene/world/effects';

import { Vector2D } from './level';

export enum ParticlesType {
  BIT = 'BIT',
  GLOW = 'GLOW',
}

export enum ParticlesTexture {
  BIT = 'effect/bit',
  GLOW = 'effect/glow',
}

export type ParticlesList = Partial<Record<ParticlesType, Phaser.GameObjects.Particles.ParticleEmitterManager>>;

export type ParticlesParent = Sprite | Building | ShotBall;

export type ParticlesData = {
  type: ParticlesType
  params: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
  duration?: number
};

export enum EffectTexture {
  EXPLOSION = 'effect/explosion',
  SMOKE = 'effect/smoke',
  DAMAGE = 'effect/damage',
}

export type EffectData = {
  texture: EffectTexture
  position: Vector2D
  audio?: string
  rate?: number
};

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObject {
        effects?: Partial<Record<ParticlesType, Particles>>
      }
    }
  }
}

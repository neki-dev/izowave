import { Building } from '~game/scenes/world/entities/building';
import { ShotBall } from '~game/scenes/world/entities/shot/ball';
import { Sprite } from '~game/scenes/world/entities/sprite';
import { Particles } from '~game/scenes/world/effects';

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
  position: Phaser.Types.Math.Vector2Like
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

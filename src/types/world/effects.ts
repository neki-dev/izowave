import { Building } from '~entity/building';
import { ShotBall } from '~entity/shot/ball';
import { Sprite } from '~entity/sprite';
import { Particles } from '~scene/world/effects';

export enum ParticlesType {
  BLOOD = 'BLOOD',
  GLOW = 'GLOW',
}

export enum ParticlesTexture {
  BLOOD = 'effect/blood',
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

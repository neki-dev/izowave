export enum WorldEffect {
  BLOOD = 'BLOOD',
  GLOW = 'GLOW',
}

export type WorldEffectParticles = Partial<Record<WorldEffect, Phaser.GameObjects.Particles.ParticleEmitterManager>>;

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObject {
        effects?: Partial<Record<WorldEffect, Phaser.GameObjects.Particles.ParticleEmitter>>
      }
      namespace Particles {
        interface ParticleEmitter {
          effectType?: WorldEffect
          timer?: Phaser.Time.TimerEvent
        }
      }
    }
  }
}

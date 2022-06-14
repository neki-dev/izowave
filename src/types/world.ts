export enum WorldEffect {
  BLOOD = 'BLOOD',
  FROZE = 'FROZE',
  LAZER = 'LAZER',
  FLARE = 'FLARE',
  GLOW = 'GLOW',
}

export enum WorldTexture {
  BLOOD = 'effect/blood',
  FROZE = 'effect/splash',
  LAZER = 'effect/energy',
  GLOW = 'effect/glow',
  FLARE = 'effect/flare',
}

export enum WorldEvents {
  GAMEOVER = 'gameover',
}

export enum GameDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  UNREAL = 'UNREAL',
}

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObject {
        effects?: {
          [key in WorldEffect]?: Phaser.GameObjects.Particles.ParticleEmitter
        }
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

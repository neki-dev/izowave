export enum WorldEffect {
  BLOOD = 'BLOOD',
  GLOW = 'GLOW',
}

export enum WorldTexture {
  BLOOD = 'effect/blood',
  GLOW = 'effect/glow',
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

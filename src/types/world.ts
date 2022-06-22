export enum WorldEffect {
  BLOOD = 'BLOOD',
  LAZER = 'LAZER',
  FIRE = 'FIRE',
  GLOW = 'GLOW',
  SPAWN = 'SPAWN',
}

export enum WorldTexture {
  SPAWN = 'effect/red',
  BLOOD = 'effect/red-px',
  LAZER = 'effect/purple',
  GLOW = 'effect/blue',
  FIRE = 'effect/orange',
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

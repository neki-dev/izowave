export enum FailureType {
  BAD_DEVICE = 'BAD_DEVICE',
  BAD_SCREEN_SIZE = 'BAD_SCREEN_SIZE',
  UNCAUGHT_ERROR = 'UNCAUGHT_ERROR',
}

export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  UNREAL = 'UNREAL',
}

export type DifficultyPowers = Record<Difficulty, number>;

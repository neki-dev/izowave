export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export type DifficultyPowers = Record<Difficulty, number>;

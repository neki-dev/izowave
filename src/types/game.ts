export enum SceneKey {
  BASIC = 'BASIC',
  WORLD = 'WORLD',
  SCREEN = 'SCREEN',
  MENU = 'MENU',
}

export enum GameEvents {
  START = 'start',
  FINISH = 'finish',
}

export enum GameDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
}

export type GameDifficultyPowers = Record<GameDifficulty, number>;

export type GameStat = {
  waves?: number
  kills?: number
  level?: number
  lived?: number
};

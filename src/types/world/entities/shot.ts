export enum ShotType {
  FIRE = 'FIRE',
  FROZEN = 'FROZEN',
  LAZER = 'LAZER',
}

export enum ShotTexture {
  FIRE = 'shot/fire',
  FROZEN = 'shot/frozen',
}

export type ShotParams = {
  speed?: number
  damage?: number
  freeze?: number
};

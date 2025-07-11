import type { Live } from '../../addons/live';

import type { PositionAtWorld, PositionAtMatrix } from '~scene/world/level/types';

export interface IEnemyTarget {
  readonly live: Live
  readonly active: boolean
  getBottomEdgePosition(): PositionAtWorld
}

export enum EnemyAudio {
  ROAR = 'EnemyAudio:ROAR',
}

export enum EnemyTexture {
  SPIKE = 'EnemyTexture:SPIKE',
  RISPER = 'EnemyTexture:RISPER',
  DEMON = 'EnemyTexture:DEMON',
  UNDEAD = 'EnemyTexture:UNDEAD',
  TANK = 'EnemyTexture:TANK',
  BOSS = 'EnemyTexture:BOSS',
  GHOST = 'EnemyTexture:GHOST',
  TERMER = 'EnemyTexture:TERMER',
  BERSERK = 'EnemyTexture:BERSERK',
  EXPLOSIVE = 'EnemyTexture:EXPLOSIVE',
  STRANGER = 'EnemyTexture:STRANGER',
  ADHERENT = 'EnemyTexture:ADHERENT',
  TELEPATH = 'EnemyTexture:TELEPATH',
}

export enum EnemyVariant {
  SPIKE = 'SPIKE',
  RISPER = 'RISPER',
  DEMON = 'DEMON',
  UNDEAD = 'UNDEAD',
  TANK = 'TANK',
  BOSS = 'BOSS',
  GHOST = 'GHOST',
  TERMER = 'TERMER',
  BERSERK = 'BERSERK',
  EXPLOSIVE = 'EXPLOSIVE',
  STRANGER = 'STRANGER',
  ADHERENT = 'ADHERENT',
  TELEPATH = 'TELEPATH',
}

export enum EnemySize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export type EnemySizeParams = {
  width: number
  height: number
  gamut: number
};

export type EnemyVariantData = {
  positionAtMatrix?: PositionAtMatrix
  positionAtWorld?: PositionAtWorld
};

export type EnemyData = EnemyVariantData & {
  texture: EnemyTexture
  score?: number
  multipliers: {
    speed: number
    damage: number
    health: number
    might: number
  }
};

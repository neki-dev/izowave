import type { ILive } from '../../addons/live/types';
import type { INPC } from '../types';

import type { PositionAtWorld, PositionAtMatrix } from '~scene/world/level/types';

export interface IEnemy extends INPC {
  /**
   * Damage amount.
   */
  readonly damage: number

  /**
   * Set overlaped state.
   */
  overlapTarget(): void

  /**
   * Give target damage.
   * @param target - Target
   */
  attack(target: IEnemyTarget): void
}

export interface IEnemyTarget {
  readonly live: ILive
  active: boolean
  getBottomEdgePosition(): PositionAtWorld
}

export enum EnemyAudio {
  ROAR = 'enemy/roar',
}

export enum EnemyTexture {
  SPIKE = 'enemy/spike',
  RISPER = 'enemy/risper',
  DEMON = 'enemy/demon',
  UNDEAD = 'enemy/undead',
  TANK = 'enemy/tank',
  BOSS = 'enemy/boss',
  GHOST = 'enemy/ghost',
  TERMER = 'enemy/termer',
  BERSERK = 'enemy/berserk',
  EXPLOSIVE = 'enemy/explosive',
  STRANGER = 'enemy/stranger',
  ADHERENT = 'enemy/adherent',
  TELEPATH = 'enemy/telepath',
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

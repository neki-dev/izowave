import { ILive } from '~type/live';
import { IWorld } from '~type/world';
import { INPC } from '~type/world/entities/npc';
import { Vector2D } from '~type/world/level';

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

export interface IEnemyFactory {
  SpawnWaveRange?: number[]
  new (scene: IWorld, data: EnemyVariantData): IEnemy
}

export interface IEnemyTarget extends Vector2D {
  readonly live: ILive
  getPositionOnGround(): Vector2D
}

export enum EnemyTexture {
  BAT = 'enemy/bat',
  SPIKE = 'enemy/spike',
  RISPER = 'enemy/risper',
  DEMON = 'enemy/demon',
  TANK = 'enemy/tank',
  BOSS = 'enemy/boss',
  GHOST = 'enemy/ghost',
  TERMER = 'enemy/termer',
  EXPLOSIVE = 'enemy/explosive',
}

export enum EnemyVariant {
  BAT = 'BAT',
  SPIKE = 'SPIKE',
  RISPER = 'RISPER',
  DEMON = 'DEMON',
  TANK = 'TANK',
  BOSS = 'BOSS',
  GHOST = 'GHOST',
  TERMER = 'TERMER',
  EXPLOSIVE = 'EXPLOSIVE',
}

export type EnemyTexturesMeta = Record<EnemyTexture, {
  frameRate: number
  size: {
    width: number
    height: number
    gamut: number
  }
}>;

export type EnemyVariantData = {
  positionAtMatrix: Vector2D
};

export type EnemyData = EnemyVariantData & {
  texture: EnemyTexture
  score?: number
  multipliers: {
    speed: number
    damage: number
    health: number
  }
};

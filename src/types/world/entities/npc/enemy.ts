import { ILive } from '~type/live';
import { IWorld } from '~type/world';
import { INPC } from '~type/world/entities/npc';
import { Vector2D } from '~type/world/level';

export interface IEnemy extends INPC {
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

export interface IEnemyTarget {
  readonly live: ILive
}

export enum EnemyTexture {
  BAT = 'enemy/bat',
  SPIKE = 'enemy/spike',
  DEMON = 'enemy/demon',
  OVERLORD = 'enemy/overlord',
  BOSS = 'enemy/boss',
  IMPURE = 'enemy/impure',
  UNDEAD = 'enemy/undead',
  TERMER = 'enemy/termer',
}

export enum EnemyVariant {
  BAT = 'BAT',
  SPIKE = 'SPIKE',
  DEMON = 'DEMON',
  OVERLORD = 'OVERLORD',
  BOSS = 'BOSS',
  IMPURE = 'IMPURE',
  UNDEAD = 'UNDEAD',
  TERMER = 'TERMER',
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
  multipliers: {
    speed: number
    damage: number
    health: number
  }
};

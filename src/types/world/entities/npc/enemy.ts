import { IWorld } from '~type/world';
import { ILive } from '~type/world/entities/live';
import { INPC } from '~type/world/entities/npc';
import { Vector2D } from '~type/world/level';

export interface IEnemy extends INPC {
  /**
   * Pause enemy moving and add freeze effect.
   * @param duration - Pause duration
   */
  freeze(duration: number): void

  /**
   * Give target damage.
   * @param target - Target
   */
  attack(target: IEnemyTarget): void
}

export interface IEnemyFactory {
  SpawnMinWave: number
  SpawnFrequency: number
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
}

export enum EnemyVariant {
  BAT = 'BAT',
  SPIKE = 'SPIKE',
  DEMON = 'DEMON',
  OVERLORD = 'OVERLORD',
  BOSS = 'BOSS',
  IMPURE = 'IMPURE',
  UNDEAD = 'UNDEAD',
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
  multipliers?: {
    speed?: number
    damage?: number
    health?: number
  }
};

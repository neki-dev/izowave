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

export interface IEnemyTarget {
  readonly live: ILive
  getPositionOnGround(): Vector2D
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
  EXPLOSIVE = 'enemy/explosive',
  STRANGER = 'enemy/stranger',
  ADHERENT = 'enemy/adherent',
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
  EXPLOSIVE = 'EXPLOSIVE',
  STRANGER = 'STRANGER',
  ADHERENT = 'ADHERENT',
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
  spawnEffect?: boolean
  positionAtMatrix?: Vector2D
  positionAtWorld?: Vector2D
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

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
  new (scene: IWorld, data: EnemyVariantData): IEnemy
}

export interface IEnemyTarget {
  readonly live: ILive
}

export enum EnemyTexture {
  BAT = 'enemy/bat',
  DEMON = 'enemy/demon',
  OVERLORD = 'enemy/overlord',
  BOSS = 'enemy/overlord',
  IMPURE = 'enemy/impure',
  UNDEAD = 'enemy/undead',
  BOUCHE = 'enemy/bouche',
}

export enum EnemyAudio {
  ATTACK = 'enemy/attack',
}

export enum EnemyVariant {
  BAT = 'BAT',
  DEMON = 'DEMON',
  OVERLORD = 'OVERLORD',
  BOSS = 'BOSS',
  IMPURE = 'IMPURE',
  UNDEAD = 'UNDEAD',
  BOUCHE = 'BOUCHE',
}

export type EnemyTexturesMeta = Record<EnemyTexture, {
  frameRate: number
  size: number
}>;

export type EnemyVariantsMeta = Partial<Record<EnemyVariant, {
  spawnMinWave: number
  spawnFrequency: number
}>>;

export type EnemyVariantData = {
  positionAtMatrix: Vector2D
};

export type EnemyData = EnemyVariantData & {
  texture: EnemyTexture
  speed: number
  damage: number
  health: number
  experienceMultiply?: number
  scale?: number
};

import { Enemy } from '~entity/npc/variants/enemy';
import { World } from '~scene/world';
import { Live } from '~scene/world/live';
import { Vector2D } from '~type/world/level';

export interface IEnemyFactory {
  new (scene: World, data: EnemyVariantData): Enemy
}

export interface IEnemyTarget {
  live: Live
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

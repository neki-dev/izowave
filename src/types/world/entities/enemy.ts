import Phaser from 'phaser';
import { Building } from '~entity/building';
import { Assistant } from '~entity/npc/assistant';
import { Player } from '~entity/player';

export enum EnemyTexture {
  BAT = 'enemy/bat',
  DEMON = 'enemy/demon',
  OVERLORD = 'enemy/overlord',
  BOSS = 'enemy/overlord',
  IMPURE = 'enemy/impure',
  UNDEAD = 'enemy/undead',
  BOUCHE = 'enemy/bouche',
}

export type EnemyTexturesMeta = Record<EnemyTexture, {
  frameRate: number
  size: number
}>;

export enum EnemyVariant {
  BAT = 'BAT',
  DEMON = 'DEMON',
  OVERLORD = 'OVERLORD',
  BOSS = 'BOSS',
  IMPURE = 'IMPURE',
  UNDEAD = 'UNDEAD',
  BOUCHE = 'BOUCHE',
}

export type EnemyVariantsMeta = Partial<Record<EnemyVariant, {
  spawnMinWave: number
  spawnFrequency: number
}>>;

export type EnemyData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  texture: EnemyTexture
  speed: number
  damage: number
  health: number
  experienceMultiply?: number
  scale?: number
};

export type EnemyVariantData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
};

export type EnemyAttackTarget = Player | Assistant | Building;

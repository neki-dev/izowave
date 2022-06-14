import Phaser from 'phaser';

export enum EnemyTexture {
  BAT = 'enemy/bat',
  DEMON = 'enemy/demon',
  OVERLORD = 'enemy/overlord',
  BOSS = 'enemy/overlord',
  IMPURE = 'enemy/impure',
  UNDEAD = 'enemy/undead',
  BOUCHE = 'enemy/bouche',
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

export type EnemyData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  texture: string
  speed: number
  damage: number
  health: number
  experienceMultiply?: number
  scale?: number
};

export type EnemyVariantData = {
  positionAtMatrix: Phaser.Types.Math.Vector2Like
};

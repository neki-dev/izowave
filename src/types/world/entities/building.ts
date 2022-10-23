import Phaser from 'phaser';
import { ShotAudio, ShotTexture, ShotType } from '~type/world/entities/shot';
import { Resources, ResourceType } from '~type/world/resources';

export enum BuildingEvents {
  UPGRADE = 'upgrade',
}

export enum BuildingVariant {
  WALL = 'WALL',
  TOWER_FIRE = 'TOWER_FIRE',
  TOWER_LAZER = 'TOWER_LAZER',
  TOWER_FROZEN = 'TOWER_FROZEN',
  MINE_BRONZE = 'MINE_BRONZE',
  MINE_SILVER = 'MINE_SILVER',
  MINE_GOLD = 'MINE_GOLD',
  AMMUNITION = 'AMMUNITION',
  MEDIC = 'MEDIC',
}

export enum BuildingTexture {
  WALL = 'building/wall',
  TOWER_FIRE = 'building/tower_fire',
  TOWER_FROZEN = 'building/tower_frozen',
  TOWER_LAZER = 'building/tower_lazer',
  MINE_BRONZE = 'building/mine_bronze',
  MINE_SILVER = 'building/mine_silver',
  MINE_GOLD = 'building/mine_gold',
  AMMUNITION = 'building/ammunition',
  MEDIC = 'building/medic',
}

export enum BuildingAudio {
  SELECT = 'building/select',
  UNSELECT = 'building/unselect',
  BUILD = 'building/build',
  UPGRADE = 'building/upgrade',
  DEAD = 'building/dead',
  REMOVE = 'building/remove',
  FAILURE = 'building/failure',
  OVER = 'building/over', // Maybe replace
}

export type BuildingActionsParams = {
  radius?: number
  pause?: number
};

export type BuildingData = {
  variant: BuildingVariant
  health: number
  positionAtMatrix: Phaser.Types.Math.Vector2Like
  texture: BuildingTexture
  actions?: BuildingActionsParams
  upgradeCost: Resources
};

export type BuildingDescriptionItem = {
  text: string
  icon?: number
  type?: 'text' | 'param'
  post?: string
  color?: string
};

export interface BuildingInstance {
  Name: string
  Description: BuildingDescriptionItem[]
  Texture: BuildingTexture
  Cost: Resources
  UpgradeCost: Resources
  Health: number
  Limit?: number
}

export type BuildingTowerShotParams = {
  speed?: number
  damage?: number
  freeze?: number
};

export type BuildingTowerShotData = {
  type: ShotType
  texture?: ShotTexture
  audio?: ShotAudio
  glowColor?: number
  params: BuildingTowerShotParams
};

export type BuildingTowerData = BuildingData & {
  shotData: BuildingTowerShotData
};

export type BuildingMineData = BuildingData & {
  resourceType: ResourceType
};

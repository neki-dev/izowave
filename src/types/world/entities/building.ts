import Phaser from 'phaser';

import { ComponentCreator } from '~type/interface';
import { ScreenIcon } from '~type/screen';
import { ShotInstance } from '~type/world/entities/shot';

export enum BuildingEvents {
  UPGRADE = 'upgrade',
}

export enum BuildingVariant {
  WALL = 'WALL',
  TOWER_FIRE = 'TOWER_FIRE',
  TOWER_LAZER = 'TOWER_LAZER',
  TOWER_FROZEN = 'TOWER_FROZEN',
  GENERATOR = 'GENERATOR',
  AMMUNITION = 'AMMUNITION',
  MEDIC = 'MEDIC',
}

export enum BuildingTexture {
  WALL = 'building/wall',
  TOWER_FIRE = 'building/tower_fire',
  TOWER_FROZEN = 'building/tower_frozen',
  TOWER_LAZER = 'building/tower_lazer',
  GENERATOR = 'building/generator',
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
  OVER = 'building/over',
  RELOAD = 'building/reload',
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
};

export type BuildingParamItem = {
  label: string
  value: string | number
  icon: ScreenIcon
  color?: string
};

export type BuildingAction = {
  label: string
  addon?: {
    component: ComponentCreator
    props?: any
  }
  onClick: () => void
};

export interface BuildingMeta {
  Name: string
  Description: string
  Params: BuildingParamItem[]
  Texture: BuildingTexture
  Cost: number
  Health: number
  Limit?: number
  AllowByWave?: number
}

export type BuildingTowerShotParams = {
  speed?: number
  damage?: number
  freeze?: number
};

export type BuildingTowerData = BuildingData & {
  shotData: {
    instance: ShotInstance
    params: BuildingTowerShotParams
  }
};

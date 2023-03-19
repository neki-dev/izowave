import { Building } from '~entity/building';
import { World } from '~scene/world';
import { ComponentCreator } from '~type/interface';
import { ScreenIcon } from '~type/screen';

import { Vector2D } from '../level';

export interface IBuildingFactory {
  Name: string
  Description: string
  Params: BuildingParamItem[]
  Texture: BuildingTexture
  Cost: number
  Health: number
  Limit?: number
  AllowByWave?: number
  new (scene: World, data: BuildingVariantData): Building
}

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

export enum BuildingOutlineState {
  NONE = 'NONE',
  FOCUSED = 'FOCUSED',
  SELECTED = 'SELECTED',
  ALERT = 'ALERT',
}

export type BuildingActionsParams = {
  radius?: number
  pause?: number
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

export type BuildingVariantData = {
  positionAtMatrix: Vector2D
};

export type BuildingData = BuildingVariantData & {
  variant: BuildingVariant
  health: number
  texture: BuildingTexture
  actions?: BuildingActionsParams
};

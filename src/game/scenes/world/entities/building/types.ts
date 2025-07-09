import type { LangPhrase } from '~lib/lang/types';
import type { PositionAtMatrix } from '~scene/world/level/types';

export enum BuildingEvent {
  UPGRADE = 'upgrade',
  BUY_AMMO = 'buy_ammo',
  BREAK = 'break',
  CREATE = 'create',
}

export enum BuildingVariant {
  WALL = 'WALL',
  TOWER_FIRE = 'TOWER_FIRE',
  TOWER_LAZER = 'TOWER_LAZER',
  TOWER_FROZEN = 'TOWER_FROZEN',
  TOWER_ELECTRO = 'TOWER_ELECTRO',
  GENERATOR = 'GENERATOR',
  AMMUNITION = 'AMMUNITION',
  RADAR = 'RADAR',
  BOOSTER = 'BOOSTER',
}

export enum BuildingTexture {
  WALL = 'building/textures/wall',
  TOWER_FIRE = 'building/textures/tower_fire',
  TOWER_FROZEN = 'building/textures/tower_frozen',
  TOWER_LAZER = 'building/textures/tower_lazer',
  TOWER_ELECTRO = 'building/textures/tower_electro',
  GENERATOR = 'building/textures/generator',
  AMMUNITION = 'building/textures/ammunition',
  RADAR = 'building/textures/radar',
  BOOSTER = 'building/textures/booster',
}

export enum BuildingIcon {
  CONFIRM = 'building/icons/confirm',
  CONFIRM_DISABLED = 'building/icons/confirm_disabled',
  DECLINE = 'building/icons/decline',
  ALERT = 'building/icons/alert',
  UPGRADE = 'building/icons/upgrade',
  AMMO = 'building/icons/params/ammo',
  DAMAGE = 'building/icons/params/damage',
  SPEED = 'building/icons/params/speed',
  DELAY = 'building/icons/params/delay',
  POWER = 'building/icons/params/power',
  FREEZE = 'building/icons/params/freeze',
}

export enum BuildingAudio {
  SELECT = 'building/select',
  UNSELECT = 'building/unselect',
  BUILD = 'building/build',
  UPGRADE = 'building/upgrade',
  DEAD = 'building/dead',
  OVER = 'building/over',
  RELOAD = 'building/reload',
  REPAIR = 'building/repair',
  DAMAGE_1 = 'building/damage_1',
  DAMAGE_2 = 'building/damage_2',
  ELECTRO = 'building/electro',
}

export enum BuildingOutlineState {
  NONE = 'NONE',
  FOCUSED = 'FOCUSED',
  SELECTED = 'SELECTED',
}

export enum BuildingCategory {
  DEFENSE = 'DEFENSE',
  ATTACK = 'ATTACK',
  RESOURCES = 'RESOURCES',
  OTHER = 'OTHER',
}

export type BuildingGrowthValue = {
  default: number
  growth: number
};

export type BuildingParam = {
  label: LangPhrase
  value: string | number
  icon: BuildingIcon
  attention?: boolean
};

export type BuildingControl = {
  label: LangPhrase
  cost?: number
  disabled?: boolean
  hotkey: string
  onClick: () => void
};

export type BuildingVariantData = {
  buildDuration?: number
  positionAtMatrix: PositionAtMatrix
};

export type BuildingBuildData = BuildingVariantData & {
  variant: BuildingVariant
};

export type BuildingData = BuildingVariantData & {
  variant: BuildingVariant
  health: number
  texture: BuildingTexture
  radius?: BuildingGrowthValue
  delay?: BuildingGrowthValue
};

export type BuildingSavePayload = {
  variant: BuildingVariant
  position: PositionAtMatrix
  health: number
  upgradeLevel: number
  ammo?: number
};

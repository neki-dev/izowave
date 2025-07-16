import type { LangPhrase } from '~core/lang/types';
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
  WALL = 'BuildingTexture:WALL',
  TOWER_FIRE = 'BuildingTexture:TOWER_FIRE',
  TOWER_FROZEN = 'BuildingTexture:TOWER_FROZEN',
  TOWER_LAZER = 'BuildingTexture:TOWER_LAZER',
  TOWER_ELECTRO = 'BuildingTexture:TOWER_ELECTRO',
  GENERATOR = 'BuildingTexture:GENERATOR',
  AMMUNITION = 'BuildingTexture:AMMUNITION',
  RADAR = 'BuildingTexture:RADAR',
  BOOSTER = 'BuildingTexture:BOOSTER',
}

export enum BuildingIcon {
  CONFIRM = 'BuildingIcon:CONFIRM',
  CONFIRM_DISABLED = 'BuildingIcon:CONFIRM_DISABLED',
  DECLINE = 'BuildingIcon:DECLINE',
  ALERT = 'BuildingIcon:ALERT',
  UPGRADE = 'BuildingIcon:UPGRADE',
  AMMO = 'BuildingIcon:AMMO',
  DAMAGE = 'BuildingIcon:DAMAGE',
  SPEED = 'BuildingIcon:SPEED',
  DELAY = 'BuildingIcon:DELAY',
  POWER = 'BuildingIcon:POWER',
  FREEZE = 'BuildingIcon:FREEZE',
}

export enum BuildingAudio {
  SELECT = 'BuildingAudio:SELECT',
  UNSELECT = 'BuildingAudio:UNSELECT',
  BUILD = 'BuildingAudio:BUILD',
  UPGRADE = 'BuildingAudio:UPGRADE',
  DEAD = 'BuildingAudio:DEAD',
  OVER = 'BuildingAudio:OVER',
  RELOAD = 'BuildingAudio:RELOAD',
  REPAIR = 'BuildingAudio:REPAIR',
  DAMAGE_1 = 'BuildingAudio:DAMAGE_1',
  DAMAGE_2 = 'BuildingAudio:DAMAGE_2',
  ELECTRO = 'BuildingAudio:ELECTRO',
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

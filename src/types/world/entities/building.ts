import Phaser from 'phaser';

import { ILive } from '~type/live';
import { IWorld } from '~type/world';
import { IParticlesParent } from '~type/world/effects';
import { IEnemyTarget } from '~type/world/entities/npc/enemy';
import { IShotInitiator } from '~type/world/entities/shot';
import { Vector2D } from '~type/world/level';

export interface IBuilding extends Phaser.GameObjects.Image, IEnemyTarget, IParticlesParent, IShotInitiator {
  readonly scene: IWorld

  /**
   * Health management.
   */
  readonly live: ILive

  /**
   * Current upgrade level.
   */
  readonly upgradeLevel: number

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: Vector2D

  /**
   * Variant name.
   */
  readonly variant: BuildingVariant

  /**
   * Is cursor on building.
   */
  readonly isFocused: boolean

  /**
   * Check is position inside action area.
   * @param position - Position at world
   */
  actionsAreaContains(position: Vector2D): boolean

  /**
   * Pause actions.
   */
  pauseActions(): void

  /**
   * Check is actions not paused.
   */
  isActionAllowed(): boolean

  /**
   * Get building information params.
   */
  getInfo(): BuildingParam[]

  /**
   * Get building controls.
   */
  getControls(): BuildingControl[]

  /**
   * Get building meta.
   */
  getMeta(): IBuildingFactory

  /**
   * Get actions radius.
   */
  getActionsRadius(): number

  /**
   * Get actions pause.
   */
  getActionsPause(): number

  /**
   * Get resources need to upgrade level.
   * @param level - Specified upgrade level
   */
  getUpgradeCost(level?: number): number

  /**
   * Get position with height offset.
   */
  getPositionOnGround(): Vector2D

  /**
   * Set building active state.
   */
  select(): void

  /**
   * Remove building active state.
   */
  unselect(): void

  /**
   * Add alert icon.
   */
  addAlertIcon(): void

  /**
   * Remove alert icon.
   */
  removeAlertIcon(): void
}

export interface IBuildingAmmunition extends IBuilding {
  /**
   * Current ammo count.
   */
  readonly ammo: number

  /**
   * Use ammunition.
   * Returns count of ammo which was used.
   */
  use(amount: number): number
}

export interface IBuildingTower extends IBuilding {
  /**
   * Current ammo in clip.
   */
  readonly ammo: number
}

export interface IBuildingFactory {
  Name: string
  Description: string
  Params: BuildingParam[]
  Texture: BuildingTexture
  Cost: number
  Health: number
  Limit?: boolean
  AllowByWave?: number
  new (scene: IWorld, data: BuildingVariantData): IBuilding
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
  RADAR = 'RADAR',
}

export enum BuildingTexture {
  WALL = 'building/textures/wall',
  TOWER_FIRE = 'building/textures/tower_fire',
  TOWER_FROZEN = 'building/textures/tower_frozen',
  TOWER_LAZER = 'building/textures/tower_lazer',
  GENERATOR = 'building/textures/generator',
  AMMUNITION = 'building/textures/ammunition',
  MEDIC = 'building/textures/medic',
  RADAR = 'building/textures/radar',
}

export enum BuildingIcon {
  ALERT = 'building/icons/alert',
  UPGRADE = 'building/icons/upgrade',
  HEALTH = 'building/icons/params/health',
  RADIUS = 'building/icons/params/radius',
  AMMO = 'building/icons/params/ammo',
  HEAL = 'building/icons/params/heal',
  DAMAGE = 'building/icons/params/damage',
  RESOURCES = 'building/icons/params/resources',
  SPEED = 'building/icons/params/speed',
  PAUSE = 'building/icons/params/pause',
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
}

export enum BuildingOutlineState {
  NONE = 'NONE',
  FOCUSED = 'FOCUSED',
  SELECTED = 'SELECTED',
}

export type BuildingActionsParams = {
  radius?: number
  pause?: number
};

export type BuildingParam = {
  label: string
  value: string | number
  icon: BuildingIcon
  attention?: boolean
};

export type BuildingControl = {
  label: string
  cost?: number
  disabled?: boolean
  onClick: () => void
};

export type BuildingVariantData = {
  positionAtMatrix: Vector2D
};

export type BuildingData = BuildingVariantData & {
  variant: BuildingVariant
  health: number
  texture: BuildingTexture
  actions?: Nullable<BuildingActionsParams>
};

import EventEmitter from 'events';

import { IWorld } from '~type/world';
import { BuildingVariant, IBuilding } from '~type/world/entities/building';
import { Vector2D } from '~type/world/level';

export interface IBuilder extends EventEmitter {
  readonly scene: IWorld

  /**
   * Build state.
   */
  readonly isBuild: boolean

  /**
   * Selected building variant.
   */
  readonly variant: Nullable<BuildingVariant>

  /**
   * Radius of build area.
   */
  readonly radius: number

  /**
   * Current active building.
   */
  selectedBuilding: Nullable<IBuilding>

  /**
   * Toggle build state and update build area.
   */
  update(): void

  /**
   * Set current building variant.
   */
  setBuildingVariant(variant: BuildingVariant): void

  /**
   * Unset building variant.
   */
  unsetBuildingVariant(): void

  /**
   * Update radius of build area.
   * @param radius - Radius
   */
  setBuildAreaRadius(radius: number): void

  /**
   * Add rubble foundation on position.
   * @param position - Position at matrix
   */
  addFoundation(position: Vector2D): void

  /**
   * Get building limit on current wave.
   * @param variant - Building variant
   */
  getBuildingLimit(variant: BuildingVariant): Nullable<number>

  /**
   * Check is tutorial allow building variant.
   * @param variant - Building variant
   */
  isBuildingAllowByTutorial(variant: BuildingVariant): boolean

  /**
   * Check is current wave allow building variant.
   * @param variant - Building variant
   */
  isBuildingAllowByWave(variant: BuildingVariant): boolean

  /**
   * Get list of buildings with a specific variant.
   * @param variant - Varaint
   */
  getBuildingsByVariant(variant: BuildingVariant): IBuilding[]
}

export enum BuilderEvents {
  UPGRADE = 'upgrade',
  BUILD = 'build',
  BUILD_START = 'build_start',
  BUILD_STOP = 'build_stop',
}

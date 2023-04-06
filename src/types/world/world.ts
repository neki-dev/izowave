import Phaser from 'phaser';

import { IGame, IScene } from '~type/game';
import { IBuilder } from '~type/world/builder';
import { ParticlesList } from '~type/world/effects';
import { BuildingVariant, IBuilding } from '~type/world/entities/building';
import { EnemyVariant, IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { ILevel, Vector2D } from '~type/world/level';
import { IWave } from '~type/world/wave';

export interface IWorld extends IScene {
  readonly game: IGame

  /**
   * Wave.
   */
  readonly wave: IWave

  /**
   * Player.
   */
  readonly player: IPlayer

  /**
   * Level.
   */
  readonly level: ILevel

  /**
   * Builder.
   */
  readonly builder: IBuilder

  /**
   * Groups of entities.
   */
  readonly entityGroups: Record<string, Phaser.GameObjects.Group>

  /**
   * Particles manager.
   */
  readonly particles: ParticlesList

  /**
   * Start world.
   */
  start(): void

  /**
   * Get lifecyle time.
   */
  getTime(): number

  /**
   * Get game lifecyle pause state.
   */
  isTimePaused(): boolean

  /**
   * Set game lifecyle pause state.
   * @param state - Pause state
   */
  setTimePause(state: boolean): void

  /**
   * Get list of buildings
   */
  getBuildings(): IBuilding[]

  /**
   * Get list of buildings with a specific variant.
   * @param variant - Varaint
   */
  getBuildingsByVariant(variant: BuildingVariant): IBuilding[]

  /**
   * Get list of enemies
   */
  getEnemies(): IEnemy[]

  /**
   * Spawn enemy in random position.
   */
  spawnEnemy(variant: EnemyVariant): Nullable<IEnemy>

  /**
   * Show hint on world.
   * @param hint - Hint data
   */
  showHint(hint: WorldHint): void

  /**
   * Hide hint from world.
   */
  hideHint(): void
}

export enum WorldEvents {
  SELECT_BUILDING = 'select_building',
  UNSELECT_BUILDING = 'unselect_building',
  SHOW_HINT = 'show_hint',
  HIDE_HINT = 'hide_hint',
}

export type WorldHint = {
  side: 'left' | 'right' | 'top' | 'bottom'
  text: string
  position: Vector2D
};

import Phaser from 'phaser';

import { LangPhrase } from '~type/lang';
import { IScene } from '~type/scene';
import { StorageSavePayload } from '~type/storage';
import { IBuilder } from '~type/world/builder';
import { ICamera } from '~type/world/camera';
import { EntityType } from '~type/world/entities';
import { BuildingSavePayload } from '~type/world/entities/building';
import { CrystalSavePayload } from '~type/world/entities/crystal';
import { IAssistant } from '~type/world/entities/npc/assistant';
import { EnemyVariant, IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { ISprite } from '~type/world/entities/sprite';
import { ILevel, Vector2D } from '~type/world/level';
import { IWave } from '~type/world/wave';

export interface IWorld extends IScene {
  /**
   * Wave.
   */
  readonly wave: IWave

  /**
   * Player.
   */
  readonly player: IPlayer

  /**
   * Player assistant.
   */
  readonly assistant: IAssistant

  /**
   * Level.
   */
  readonly level: ILevel

  /**
   * Camera.
   */
  readonly camera: ICamera

  /**
   * Builder.
   */
  readonly builder: IBuilder

  /**
   * Delta time of frame update.
   */
  readonly deltaTime: number

  /**
   * List of generated enemy spawn positions
   */
  enemySpawnPositions: Vector2D[]

  /**
   * Start world.
   * @param data - Saved data
   */
  start(data?: StorageSavePayload): void

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
   * Get count of resources generate per second.
   */
  getResourceExtractionSpeed(): number

  /**
   * Add entity to group.
   * @param gameObject - Entity
   * @param type - Group type
   */
  addEntityToGroup(gameObject: Phaser.GameObjects.GameObject, type: EntityType): void

  /**
   * Get entities group.
   */
  getEntitiesGroup(type: EntityType): Phaser.GameObjects.Group

  /**
   * Get entities list from group.
   */
  getEntities<T>(type: EntityType): T[]

  /**
   * Spawn enemy in random position.
   * @param variant - Enemy variant
   */
  spawnEnemy(variant: EnemyVariant): Nullable<IEnemy>

  /**
   * Show hint on world.
   * @param hint - Hint data
   */
  showHint(hint: WorldHint): string

  /**
   * Hide hint from world.
   * @param id - Hint id
   */
  hideHint(id?: string): void

  /**
   * Precalculate sprite position after specified time.
   * @param sprite - Sprite
   * @param seconds - Time in seconds
   */
  getFuturePosition(sprite: ISprite, seconds: number): Vector2D

  /**
   * Get random enemy spawn position.
   */
  getEnemySpawnPosition(): Vector2D

  /**
   * Check is mode active.
   * @param mode - Mode
   */
  isModeActive(mode: WorldMode): boolean

  /**
   * Set mode active state.
   * @param mode - Mode
   * @param state - State
   */
  setModeActive(mode: WorldMode, state: boolean): void

  /**
   * Get data for saving.
   */
  getSavePayload(): WorldSavePayload
}

export enum WorldEvents {
  SELECT_BUILDING = 'select_building',
  UNSELECT_BUILDING = 'unselect_building',
  SHOW_HINT = 'show_hint',
  HIDE_HINT = 'hide_hint',
  USE_SUPERSKILL = 'use_superskill',
  TOGGLE_MODE = 'toggle_mode',
}

export enum WorldMode {
  BUILDING_INDICATORS = 'BUILDING_INDICATORS',
  AUTO_REPAIR = 'AUTO_REPAIR',
}

export type WorldHint = {
  side: 'left' | 'right' | 'top' | 'bottom'
  label: LangPhrase
  position: Vector2D
  unique?: boolean
};

export type WorldSavePayload = {
  time: number
  buildings: Array<BuildingSavePayload>
  crystals: Array<CrystalSavePayload>
};

import Phaser from 'phaser';

import { IScene } from '~type/scene';
import { IBuilder } from '~type/world/builder';
import { ICamera } from '~type/world/camera';
import { EntityType } from '~type/world/entities';
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
  readonly assistant: Nullable<IAssistant>

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
   * Add entity to group.
   */
  addEntity(type: EntityType, gameObject: Phaser.GameObjects.GameObject): void

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
  getEnemySpawnPosition(): Nullable<Vector2D>
}

export enum WorldEvents {
  SELECT_BUILDING = 'select_building',
  UNSELECT_BUILDING = 'unselect_building',
  SHOW_HINT = 'show_hint',
  HIDE_HINT = 'hide_hint',
  USE_SUPERSKILL = 'use_superskill',
}

export type WorldHint = {
  side: 'left' | 'right' | 'top' | 'bottom'
  text: string
  position: Vector2D
};

import type Phaser from 'phaser';

import type { LangPhrase } from '~lib/lang/types';
import type { StorageSavePayload } from '~lib/storage/types';
import type { IScene } from '~scene/types';

import type { IBuilder } from './builder/types';
import type { ICamera } from './camera/types';
import type { BuildingSavePayload } from './entities/building/types';
import type { CrystalSavePayload } from './entities/crystal/types';
import type { IAssistant } from './entities/npc/assistant/types';
import type { IPlayer } from './entities/player/types';
import type { EntityType, ISprite } from './entities/types';
import type { IFXManager } from './fx-manager/types';
import type { ILevel, PositionAtWorld } from './level/types';
import type { ISpawner } from './spawner/types';
import type { IWave } from './wave/types';

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
   * Enemy spawner.
   */
  readonly spawner: ISpawner

  /**
   * Particles and effects manager.
   */
  readonly fx: IFXManager

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
   * Get game lifecyle speed.
   */
  getTimeScale(): number

  /**
   * Set game lifecyle speed.
   * @param scale - Scale value
   */
  setTimeScale(scale: number): void

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
  getFuturePosition(sprite: ISprite, seconds: number): PositionAtWorld

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
   * Add timer event.
   * @param params - Timer params
   */
  addProgression(params: WorldTimerParams): Phaser.Time.TimerEvent

  /**
   * Remove timer event.
   * @param timer - Timer
   */
  removeProgression(timer: Phaser.Time.TimerEvent): void

  /**
   * Get data for saving.
   */
  getSavePayload(): WorldSavePayload
}

export enum WorldEvent {
  SELECT_BUILDING = 'select_building',
  UNSELECT_BUILDING = 'unselect_building',
  SHOW_HINT = 'show_hint',
  HIDE_HINT = 'hide_hint',
  TOGGLE_MODE = 'toggle_mode',
}

export enum WorldMode {
  TIME_SCALE = 'TIME_SCALE',
  BUILDING_INDICATORS = 'BUILDING_INDICATORS',
  AUTO_REPAIR = 'AUTO_REPAIR',
  PATH_TO_CRYSTAL = 'PATH_TO_CRYSTAL',
}

export enum WorldModeIcon {
  TIME_SCALE = 'world/modes/time_scale',
  BUILDING_INDICATORS = 'world/modes/building_indicators',
  AUTO_REPAIR = 'world/modes/auto_repair',
  PATH_TO_CRYSTAL = 'world/modes/path_to_crystal',
}

export type WorldHint = {
  side: 'left' | 'right' | 'top' | 'bottom'
  label: LangPhrase
  position: PositionAtWorld | (() => PositionAtWorld)
  unique?: boolean
};

export type WorldTimerParams = {
  frequence?: number
  duration: number
  onProgress?: (left: number, total: number) => void
  onComplete: () => void
};

export type WorldSavePayload = {
  time: number
  buildings: Array<BuildingSavePayload>
  crystals: Array<CrystalSavePayload>
};

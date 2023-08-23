import { GameSavePayload, IGame } from '~type/game';
import { PlayerSavePayload } from '~type/world/entities/player';
import { LevelSavePayload } from '~type/world/level';
import { WaveSavePayload } from '~type/world/wave';

import { WorldSavePayload } from './world';

export interface IStorage {
  /**
   * Loaded saves.
   */
  readonly saves: StorageSave[]

  /**
   * Init storage.
   */
  init(): Promise<void>

  /**
   * Load game saves.
   */
  load(): Promise<void>

  /**
   * Delete save data.
   * @param name - Save name
   */
  delete(name: string): Promise<void>

  /**
   * Save game data.
   * @param game - Game data
   * @param name - Save name
   */
  save(game: IGame, name: string): Promise<StorageSave | null>
}

export type StorageSave = {
  name: string
  date: number
  payload: StorageSavePayload
};

export type StorageSavePayload = {
  game: GameSavePayload
  world: WorldSavePayload
  level: LevelSavePayload
  wave: WaveSavePayload
  player: PlayerSavePayload
};

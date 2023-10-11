import { GameSavePayload } from '~type/game';
import { PlayerSavePayload } from '~type/world/entities/player';
import { LevelSavePayload } from '~type/world/level';
import { WaveSavePayload } from '~type/world/wave';

import { WorldSavePayload } from './world';

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

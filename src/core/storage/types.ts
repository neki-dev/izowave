import type { GameSavePayload } from '~game/types';
import type { PlayerSavePayload } from '~scene/world/entities/player/types';
import type { LevelSavePayload } from '~scene/world/level/types';
import type { WorldSavePayload } from '~scene/world/types';
import type { WaveSavePayload } from '~scene/world/wave/types';

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

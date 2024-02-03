import { GameSavePayload } from '../../game/types';
import { PlayerSavePayload } from '~scene/world/entities/player/types';
import { LevelSavePayload } from '~scene/world/level/types';
import { WorldSavePayload } from '~scene/world/types';
import { WaveSavePayload } from '~scene/world/wave/types';

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

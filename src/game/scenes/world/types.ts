import type { BuildingSavePayload } from './entities/building/types';
import type { CrystalSavePayload } from './entities/crystal/types';
import type { PositionAtWorld } from './level/types';

import type { LangPhrase } from '~lib/lang/types';

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

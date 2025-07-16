import type { LevelPlanet } from '../world/level/types';

import type { LangPhrase } from '~core/lang/types';

export type MenuItem = {
  label: LangPhrase
  page?: MenuPage
  disabled?: boolean
  onClick?: () => void
};

export enum MenuPage {
  NEW_GAME = 'NEW_GAME',
  LOAD_GAME = 'LOAD_GAME',
  SAVE_GAME = 'SAVE_GAME',
  SETTINGS = 'SETTINGS',
  ABOUT_GAME = 'ABOUT_GAME',
  CONTROLS = 'CONTROLS',
}

export type MenuData = {
  background?: boolean
  defaultPage?: MenuPage
  planet?: LevelPlanet
}

import { Vector2D } from '~type/world/level';

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

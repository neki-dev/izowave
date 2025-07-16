import type { ControlItem } from './types';

export const CONTROL_KEY = {
  PAUSE: 'keyup-ESC',

  BUILDING_DESTROY: 'keyup-BACKSPACE',
  BUILDING_REPAIR: 'keyup-R',
  BUILDING_BUY_AMMO: 'keyup-F',
  BUILDING_UPGRADE: 'keyup-E',
};

export const CONTROLS: ControlItem[] = [
  { keys: 'W,A,S,D', label: 'MOVEMENT' },
  { keys: 'LEFT CLICK', label: 'BUILD' },
  { keys: 'RIGHT CLICK', label: 'STOP_BUILD' },
  { keys: 'E', label: 'UPGRADE_BUILDING' },
  { keys: 'R', label: 'REPAIR_BUILDING' },
  { keys: 'F', label: 'BUY_AMMO' },
  { keys: 'BACKSPACE', label: 'DESTROY_BUILDING' },
];

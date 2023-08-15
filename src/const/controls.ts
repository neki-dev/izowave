import { ControlItem } from '~type/controls';

export const CONTROL_KEY = {
  MOVEMENT: 'W,A,S,D,UP,LEFT,DOWN,RIGHT',

  PAUSE: 'keyup-ESC',

  BUILDING_DESTROY: 'keyup-BACKSPACE',
  BUILDING_REPEAR: 'keyup-R',
  BUILDING_UPGRADE: 'keyup-E',
  BUILDING_UPGRADE_ANALOG: 'keyup-U',

  SKIP_WAVE_TIMELEFT: 'keyup-N',
};

export const CONTROLS: ControlItem[] = [
  { name: 'W,A,S,D', description: 'Movement' },
  { name: 'E', description: 'Upgrade active building' },
  { name: 'LEFT CLICK', description: 'Build' },
  { name: 'R', description: 'Repair active building' },
  { name: 'RIGHT CLICK', description: 'Stop build' },
  { name: 'BACKSPACE', description: 'Destroy active building' },
  { name: 'N', description: 'Skip wave timeleft' },
];

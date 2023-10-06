import { ControlItem } from '~type/controls';

export const CONTROL_KEY = {
  PAUSE: 'keyup-ESC',

  BUILDING_DESTROY: 'keyup-BACKSPACE',
  BUILDING_REPEAR: 'keyup-R',
  BUILDING_UPGRADE: 'keyup-E',

  SKIP_WAVE_TIMELEFT: 'keyup-N',
};

export const CONTROLS: ControlItem[] = [
  { name: 'W,A,S,D', description: 'Movement' },
  { name: 'LEFT CLICK', description: 'Build' },
  { name: 'RIGHT CLICK', description: 'Stop build' },
  { name: 'E', description: 'Upgrade active building' },
  { name: 'R', description: 'Repair active building' },
  { name: 'BACKSPACE', description: 'Destroy active building' },
  { name: 'N', description: 'Skip wave timeleft' },
];

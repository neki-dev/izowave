import { ControlItem } from '~type/controls';

export const CONTROL_KEY = {
  MOVEMENT: 'W,A,S,D,UP,LEFT,DOWN,RIGHT',

  PAUSE: 'keyup-ESC',
  START: 'keyup-ENTER',

  BUILDING_DESTROY: 'keyup-BACKSPACE',
  BUILDING_UPGRADE: 'keyup-E',
  BUILDING_UPGRADE_ANALOG: 'keyup-U',

  SKIP_WAVE_TIMELEFT: 'keyup-N',
};

export const CONTROLS: ControlItem[] = [
  { name: 'W,A,S,D', description: 'Move player' },
  { name: 'LEFT CLICK', description: 'Build' },
  { name: 'RIGHT CLICK', description: 'Stop build' },
  { name: 'E', description: 'Upgrade active building' },
  { name: 'BACKSPACE', description: 'Destroy active building' },
  { name: 'N', description: 'Skip wave timeleft' },
];

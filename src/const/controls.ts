import { ControlItem } from '~type/controls';

export const CONTROL_KEY = {
  MOVEMENT: 'W,A,S,D,UP,LEFT,DOWN,RIGHT',

  PAUSE: 'keyup-ESC',
  START: 'keyup-ENTER',

  BUILDING_UPGRADE: 'keyup-U',
  BUILDING_DESTROY: 'keyup-BACKSPACE',
  BUILDING_RELOAD: 'keyup-R',

  WAVE_TIMELEFT_AFTER_SKIP: 'keyup-N',

  ZOOM_IN: 'keyup-PLUS',
  ZOOM_OUT: 'keyup-MINUS',
};

export const CONTROLS: ControlItem[] = [
  { name: 'W A S D', description: 'Move player' },
  { name: 'U', description: 'Upgrade building' },
  { name: 'R', description: 'Reload tower ammo' },
  { name: 'BACKSPACE', description: 'Destroy building' },
  { name: 'N', description: 'Skip wave timeleft' },
  { name: '- +', description: 'Change zoom' },
];

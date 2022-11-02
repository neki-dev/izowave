import { ControlItem } from '~type/controls';

export const CONTROL_KEY = {
  MOVEMENT: 'W,A,S,D,UP,LEFT,DOWN,RIGHT',

  PAUSE: 'keyup-ESC',
  START: 'keyup-ENTER',

  BUILDING_UPGRADE: 'keyup-U',
  BUILDING_DESTROY: 'keyup-BACKSPACE',
  BUILDING_RELOAD: 'keyup-R',

  WAVE_SKIP_TIMELEFT: 'keyup-N',
};

export const CONTROLS: ControlItem[] = [
  { name: 'W A S D', description: 'Move player' },
  { name: 'U', description: 'Upgrade building' },
  { name: 'R', description: 'Reload tower ammo' },
  { name: 'BACKSPACE', description: 'Destroy building' },
  { name: 'N', description: 'Skip wave time left' },
];

import { MovementDirectionValue } from '~type/player';

import { TILE_META } from '~const/level';

export const PLAYER_TILE_SIZE = 16;

export const PLAYER_RECORD_KEY = 'BEST_GAME_RESULT';

const anticollide = 1.00; // 0.95;
const angle = TILE_META.deg * anticollide;
export const PLAYER_MOVE_DIRECTIONS = {
  [`${MovementDirectionValue.RIGHT}|${MovementDirectionValue.NONE}`]: 0,
  [`${MovementDirectionValue.RIGHT}|${MovementDirectionValue.DOWN}`]: angle,
  [`${MovementDirectionValue.RIGHT}|${MovementDirectionValue.UP}`]: -angle,
  [`${MovementDirectionValue.LEFT}|${MovementDirectionValue.NONE}`]: 180,
  [`${MovementDirectionValue.LEFT}|${MovementDirectionValue.DOWN}`]: 180 - angle,
  [`${MovementDirectionValue.LEFT}|${MovementDirectionValue.UP}`]: 180 + angle,
  [`${MovementDirectionValue.NONE}|${MovementDirectionValue.DOWN}`]: 90,
  [`${MovementDirectionValue.NONE}|${MovementDirectionValue.UP}`]: 270,
};

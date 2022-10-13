import { TILE_META } from '~const/level';
import { MovementDirectionValue } from '~type/world/entities/player';

export const PLAYER_TILE_SIZE = 16;

export const PLAYER_RECORD_KEY = 'BEST_GAME_RESULT';

const ANGLE = TILE_META.deg;
const {
  RIGHT, LEFT, UP, DOWN, NONE,
} = MovementDirectionValue;
export const PLAYER_MOVE_DIRECTIONS = {
  [`${RIGHT}|${NONE}`]: 0,
  [`${RIGHT}|${DOWN}`]: ANGLE,
  [`${RIGHT}|${UP}`]: -ANGLE,
  [`${LEFT}|${NONE}`]: 180,
  [`${LEFT}|${DOWN}`]: 180 - ANGLE,
  [`${LEFT}|${UP}`]: 180 + ANGLE,
  [`${NONE}|${DOWN}`]: 90,
  [`${NONE}|${UP}`]: 270,
};

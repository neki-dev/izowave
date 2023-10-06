import { LEVEL_TILE_SIZE } from '~const/world/level';
import {
  MovementDirection,
  PlayerSkill,
  PlayerSkillData,
  PlayerSuperskill,
  PlayerSuperskillData,
} from '~type/world/entities/player';

import { DIFFICULTY } from '../difficulty';

export const PLAYER_TILE_SIZE = {
  width: 20,
  height: 30,
  gamut: 4,
};

export const PLAYER_SKILLS: Record<PlayerSkill, PlayerSkillData> = {
  [PlayerSkill.MAX_HEALTH]: {
    label: 'Health',
    description: 'Grow health of player and assistant',
    experience: DIFFICULTY.PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
  [PlayerSkill.SPEED]: {
    label: 'Speed',
    description: 'Grow speed of player and assistant',
    experience: DIFFICULTY.PLAYER_SPEED_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
  [PlayerSkill.BUILD_AREA]: {
    label: 'Build area',
    description: 'Grow radius of build area',
    experience: DIFFICULTY.BUILDER_BUILD_AREA_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
  [PlayerSkill.ASSISTANT]: {
    label: 'Assistant',
    description: 'Grow damage, radius and speed attack',
    experience: DIFFICULTY.ASSISTANT_EXPERIENCE_TO_UPGRADE,
    maxLevel: 10,
  },
};

export const PLAYER_SUPERSKILLS: Record<PlayerSuperskill, PlayerSuperskillData> = {
  [PlayerSuperskill.FROST]: {
    description: 'Freezes all spawned enemies',
    cost: DIFFICULTY.SUPERSKILL_FROST_COST,
    duration: DIFFICULTY.SUPERSKILL_FROST_DURATION,
  },
  [PlayerSuperskill.RAGE]: {
    description: 'Doubles towers damage',
    cost: DIFFICULTY.SUPERSKILL_RAGE_COST,
    duration: DIFFICULTY.SUPERSKILL_RAGE_DURATION,
  },
  [PlayerSuperskill.SHIELD]: {
    description: 'Prevents damage to all buildings',
    cost: DIFFICULTY.SUPERSKILL_SHIELD_COST,
    duration: DIFFICULTY.SUPERSKILL_SHIELD_DURATION,
  },
  [PlayerSuperskill.FIRE]: {
    description: 'Deals damage to all enemies',
    cost: DIFFICULTY.SUPERSKILL_FIRE_COST,
    duration: DIFFICULTY.SUPERSKILL_FIRE_DURATION,
  },
};

export const PLAYER_MOVEMENT_TARGET = [
  MovementDirection.LEFT,
  MovementDirection.LEFT_UP,
  MovementDirection.UP,
  MovementDirection.RIGHT_UP,
  MovementDirection.RIGHT,
  MovementDirection.RIGHT_DOWN,
  MovementDirection.DOWN,
  MovementDirection.LEFT_DOWN,
];

export const PLAYER_MOVEMENT_ANGLES = {
  [MovementDirection.LEFT]: 180,
  [MovementDirection.LEFT_UP]: 180 + LEVEL_TILE_SIZE.deg,
  [MovementDirection.UP]: 270,
  [MovementDirection.RIGHT_UP]: 360 - LEVEL_TILE_SIZE.deg,
  [MovementDirection.RIGHT]: 0,
  [MovementDirection.RIGHT_DOWN]: 0 + LEVEL_TILE_SIZE.deg,
  [MovementDirection.DOWN]: 90,
  [MovementDirection.LEFT_DOWN]: 180 - LEVEL_TILE_SIZE.deg,
};

export const PLAYER_MOVEMENT_KEYS: Record<string, MovementDirection> = {
  w: MovementDirection.UP,
  ArrowUp: MovementDirection.UP,
  s: MovementDirection.DOWN,
  ArrowDown: MovementDirection.DOWN,
  a: MovementDirection.LEFT,
  ArrowLeft: MovementDirection.LEFT,
  d: MovementDirection.RIGHT,
  ArrowRight: MovementDirection.RIGHT,
};

import { LEVEL_TILE_SIZE } from '~const/world/level';
import {
  MovementDirection,
  PlayerSkill,
  PlayerSkillInfo,
  PlayerSkillTarget,
  PlayerSuperskill,
  PlayerSuperskillData,
} from '~type/world/entities/player';

import { DIFFICULTY } from '../difficulty';

export const PLAYER_TILE_SIZE = {
  width: 20,
  height: 30,
  gamut: 4,
};

export const PLAYER_MAX_SKILL_LEVEL = 10;

export const PLAYER_SKILLS: Record<PlayerSkill, PlayerSkillInfo> = {
  [PlayerSkill.MAX_HEALTH]: {
    label: 'Health',
    experience: DIFFICULTY.PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.SPEED]: {
    label: 'Speed',
    experience: DIFFICULTY.PLAYER_SPEED_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.BUILD_AREA]: {
    label: 'Build area',
    experience: DIFFICULTY.BUILDER_BUILD_AREA_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.ATTACK_DAMAGE]: {
    label: 'Damage',
    experience: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_DISTANCE]: {
    label: 'Attack distance',
    experience: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_SPEED]: {
    label: 'Attack speed',
    experience: DIFFICULTY.ASSISTANT_ATTACK_SPEED_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
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

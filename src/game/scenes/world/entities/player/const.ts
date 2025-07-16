import type { PlayerSkillInfo, PlayerSuperskillInfo } from './types';
import { PlayerSkill, PlayerSkillTarget, MovementDirection, PlayerSuperskill } from './types';

export const PLAYER_TILE_SIZE = {
  width: 20,
  height: 30,
  gamut: 4,
};

export const PLAYER_START_RESOURCES = 80; // Resources on game start

export const PLAYER_HEALTH = 100; // Health

export const PLAYER_HEALTH_GROWTH = 0.4; // Growth health by upgrade (Quadratic)

export const PLAYER_SPEED = 90; // Movement speed

export const PLAYER_SPEED_GROWTH = 0.0556; // Growth speed by upgrade (Linear)

export const PLAYER_STAMINA = 100; // Stamina

export const PLAYER_STAMINA_GROWTH = 0.2; // Growth stamina by upgrade (Quadratic)

export const PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH = 1.0; // Growth experience need to upgrade (Quadratic)

export const PLAYER_SUPERSKILL_COST_GROWTH = 0.25; // Growth cost by wave number (Linear)

export const PLAYER_SUPERSKILL_UNLOCK_PER_WAVE = 3; // Period of superskill unlocking

export const PLAYER_SUPERSKILLS: Record<PlayerSuperskill, PlayerSuperskillInfo> = {
  [PlayerSuperskill.FIRE]: {
    cost: 45,
    duration: 2000,
  },
  [PlayerSuperskill.SHIELD]: {
    cost: 20,
    duration: 10000,
  },
  [PlayerSuperskill.FROST]: {
    cost: 30,
    duration: 10000,
  },
  [PlayerSuperskill.INVISIBLE]: {
    cost: 25,
    duration: 5000,
  },
  [PlayerSuperskill.RAGE]: {
    cost: 45,
    duration: 10000,
  },
};

export const PLAYER_MAX_SKILL_LEVEL = 10;

export const PLAYER_SKILLS: Record<PlayerSkill, PlayerSkillInfo> = {
  [PlayerSkill.MAX_HEALTH]: {
    experience: 80,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.SPEED]: {
    experience: 80,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.STAMINA]: {
    experience: 60,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.BUILD_SPEED]: {
    experience: 40,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.ATTACK_DAMAGE]: {
    experience: 70,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_DISTANCE]: {
    experience: 40,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_SPEED]: {
    experience: 30,
    target: PlayerSkillTarget.ASSISTANT,
  },
};

export const PLAYER_MOVEMENT_KEYS: Record<string, MovementDirection> = {
  KeyW: MovementDirection.UP,
  ArrowUp: MovementDirection.UP,
  KeyS: MovementDirection.DOWN,
  ArrowDown: MovementDirection.DOWN,
  KeyA: MovementDirection.LEFT,
  ArrowLeft: MovementDirection.LEFT,
  KeyD: MovementDirection.RIGHT,
  ArrowRight: MovementDirection.RIGHT,
};

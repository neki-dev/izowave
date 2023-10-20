import {
  MovementDirection,
  PlayerSkill,
  PlayerSkillInfo,
  PlayerSkillTarget,
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
    experience: DIFFICULTY.PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.SPEED]: {
    experience: DIFFICULTY.PLAYER_SPEED_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.STAMINA]: {
    experience: DIFFICULTY.PLAYER_STAMINA_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.BUILD_SPEED]: {
    experience: DIFFICULTY.BUILDER_BUILD_SPEED_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.CHARACTER,
  },
  [PlayerSkill.ATTACK_DAMAGE]: {
    experience: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_DISTANCE]: {
    experience: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_EXPERIENCE_TO_UPGRADE,
    target: PlayerSkillTarget.ASSISTANT,
  },
  [PlayerSkill.ATTACK_SPEED]: {
    experience: DIFFICULTY.ASSISTANT_ATTACK_SPEED_EXPERIENCE_TO_UPGRADE,
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

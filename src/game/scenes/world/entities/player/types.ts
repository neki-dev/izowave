import type { PositionAtMatrix } from '~scene/world/level/types';

export enum PlayerTexture {
  PLAYER = 'player/player',
  SUPERSKILL = 'player/superskill',
}

export enum PlayerSkillIcon {
  MAX_HEALTH = 'player/skills/max_health',
  SPEED = 'player/skills/speed',
  STAMINA = 'player/skills/stamina',
  BUILD_SPEED = 'player/skills/build_speed',
  ATTACK_DAMAGE = 'player/skills/attack_damage',
  ATTACK_DISTANCE = 'player/skills/attack_distance',
  ATTACK_SPEED = 'player/skills/attack_speed',
}

export enum PlayerSuperskillIcon {
  INVISIBLE = 'player/superskills/invisible',
  FROST = 'player/superskills/frost',
  SHIELD = 'player/superskills/shield',
  RAGE = 'player/superskills/rage',
  FIRE = 'player/superskills/fire',
}

export enum PlayerAudio {
  UPGRADE = 'player/upgrade',
  WALK = 'player/walk',
  DEAD = 'player/dead',
  DAMAGE_1 = 'player/damage_1',
  DAMAGE_2 = 'player/damage_2',
  DAMAGE_3 = 'player/damage_3',
  SUPERSKILL = 'player/superskill',
}

export enum PlayerSkillTarget {
  CHARACTER = 'CHARACTER',
  ASSISTANT = 'ASSISTANT',
}

export enum PlayerSkill {
  MAX_HEALTH = 'MAX_HEALTH',
  SPEED = 'SPEED',
  STAMINA = 'STAMINA',
  BUILD_SPEED = 'BUILD_SPEED',
  ATTACK_DAMAGE = 'ATTACK_DAMAGE',
  ATTACK_DISTANCE = 'ATTACK_DISTANCE',
  ATTACK_SPEED = 'ATTACK_SPEED',
}

export enum PlayerSuperskill {
  SHIELD = 'SHIELD',
  INVISIBLE = 'INVISIBLE',
  FROST = 'FROST',
  FIRE = 'FIRE',
  RAGE = 'RAGE',
}

export enum PlayerEvent {
  USE_SUPERSKILL = 'use_superskill',
  UNLOCK_SUPERSKILL = 'unlock_superskill',
  UPGRADE_SKILL = 'upgrade_skill',
  UPDATE_EXPERIENCE = 'update_experience',
  UPDATE_SCORE = 'update_score',
  UPDATE_RESOURCES = 'update_resources',
}

export enum MovementDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type PlayerData = {
  positionAtMatrix: PositionAtMatrix
};

export type PlayerSkillInfo = {
  experience: number
  target: PlayerSkillTarget
};

export type PlayerSkillData = {
  experience: number
  type: PlayerSkill
  currentLevel: number
};

export type PlayerSavePayload = {
  position: PositionAtMatrix
  score: number
  experience: number
  resources: number
  kills: number
  health: number
  unlockedSuperskills: Partial<Record<PlayerSuperskill, boolean>>
  upgradeLevel: Record<PlayerSkill, number>
};

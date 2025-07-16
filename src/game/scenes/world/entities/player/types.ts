import type { PositionAtMatrix } from '~scene/world/level/types';

export enum PlayerTexture {
  PLAYER = 'PlayerTexture:PLAYER',
  SUPERSKILL = 'PlayerTexture:SUPERSKILL',
}

export enum PlayerSkillIcon {
  MAX_HEALTH = 'PlayerSkillIcon:MAX_HEALTH',
  SPEED = 'PlayerSkillIcon:SPEED',
  STAMINA = 'PlayerSkillIcon:STAMINA',
  BUILD_SPEED = 'PlayerSkillIcon:BUILD_SPEED',
  ATTACK_DAMAGE = 'PlayerSkillIcon:ATTACK_DAMAGE',
  ATTACK_DISTANCE = 'PlayerSkillIcon:ATTACK_DISTANCE',
  ATTACK_SPEED = 'PlayerSkillIcon:ATTACK_SPEED',
}

export enum PlayerSuperskillIcon {
  INVISIBLE = 'PlayerSuperskillIcon:INVISIBLE',
  FROST = 'PlayerSuperskillIcon:FROST',
  SHIELD = 'PlayerSuperskillIcon:SHIELD',
  RAGE = 'PlayerSuperskillIcon:RAGE',
  FIRE = 'PlayerSuperskillIcon:FIRE',
}

export enum PlayerAudio {
  UPGRADE = 'PlayerAudio:UPGRADE',
  WALK = 'PlayerAudio:WALK',
  DEAD = 'PlayerAudio:DEAD',
  DAMAGE_1 = 'PlayerAudio:DAMAGE_1',
  DAMAGE_2 = 'PlayerAudio:DAMAGE_2',
  DAMAGE_3 = 'PlayerAudio:DAMAGE_3',
  SUPERSKILL = 'PlayerAudio:SUPERSKILL',
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

export type PlayerSuperskillInfo = {
  cost: number
  duration: number
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

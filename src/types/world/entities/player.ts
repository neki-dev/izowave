import { ILive } from '~type/live';
import { IEnemyTarget } from '~type/world/entities/npc/enemy';
import { ISprite } from '~type/world/entities/sprite';
import { Vector2D } from '~type/world/level';

export interface IPlayer extends ISprite, IEnemyTarget {
  /**
   * Total number of killed enemies.
   */
  readonly kills: number

  /**
   * Player experience.
   */
  experience: number

  /**
   * Score amount.
   */
  readonly score: number

  /**
   * Resourses amount.
   */
  readonly resources: number

  /**
   * Health management.
   */
  readonly live: ILive

  /**
   * Levels of upgrades.
   */
  readonly upgradeLevel: Record<PlayerSkill, number>

  /**
   * Active superskills.
   */
  readonly activeSuperskills: Partial<Record<PlayerSuperskill, Phaser.Time.TimerEvent>>

  /**
   * Upgrade player skill.
   */
  upgrade(type: PlayerSkill): void

  /**
   * Get experience amount need to upgrade.
   */
  getExperienceToUpgrade(type: PlayerSkill): number

  /**
   * Inremeting number of killed enemies.
   */
  incrementKills(): void

  /**
   * Give player score.
   * @param amount - Amount
   */
  giveScore(amount: number): void

  /**
   * Give player experience.
   * @param amount - Amount
   */
  giveExperience(amount: number): void

  /**
   * Give player resources.
   * @param amount - Resources amount
   */
  giveResources(amount: number): void

  /**
   * Take player resources.
   * @param amount - Resources amount
   */
  takeResources(amount: number): void

  /**
   * Use superskill.
   * @param type - Superskill
   */
  useSuperskill(type: PlayerSuperskill): void

  /**
   * Get current cost of superskill.
   * @param type - Superskill
   */
  getSuperskillCost(type: PlayerSuperskill): number

  /**
   * Set angle of target movement direction.
   * @param angle - Angle
   */
  setMovementTarget(angle: Nullable<number>): void

  /**
   * Get data for saving.
   */
  getSavePayload(): PlayerSavePayload

  /**
   * Load saved data.
   * @param data - Data
   */
  loadSavePayload(data: PlayerSavePayload): void
}

export enum PlayerTexture {
  PLAYER = 'player/player',
  SUPERSKILL = 'player/superskill',
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

export enum PlayerSkill {
  MAX_HEALTH = 'MAX_HEALTH',
  SPEED = 'SPEED',
  STAMINA = 'STAMINA',
  BUILD_SPEED = 'BUILD_SPEED',
  ATTACK_DAMAGE = 'ATTACK_DAMAGE',
  ATTACK_DISTANCE = 'ATTACK_DISTANCE',
  ATTACK_SPEED = 'ATTACK_SPEED',
}

export enum MovementDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export type PlayerData = {
  positionAtMatrix: Vector2D
};

export type PlayerSkillInfo = {
  experience: number
  target: PlayerSkillTarget
};

export type PlayerSkillData = PlayerSkillInfo & {
  type: PlayerSkill
  currentLevel: number
};

export enum PlayerSkillTarget {
  CHARACTER = 'CHARACTER',
  ASSISTANT = 'ASSISTANT',
}

export enum PlayerSuperskill {
  FROST = 'FROST',
  SHIELD = 'SHIELD',
  RAGE = 'RAGE',
  FIRE = 'FIRE',
}

export type PlayerSavePayload = {
  position: Vector2D
  score: number
  experience: number
  resources: number
  kills: number
  health: number
  upgradeLevel: Record<PlayerSkill, number>
};

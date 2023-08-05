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
  readonly experience: number

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
}

export enum PlayerTexture {
  PLAYER = 'player',
}

export enum PlayerAudio {
  UPGRADE = 'player/upgrade',
  WALK = 'player/walk',
  DEAD = 'player/dead',
  DAMAGE_1 = 'player/damage_1',
  DAMAGE_2 = 'player/damage_2',
  DAMAGE_3 = 'player/damage_3',
}

export enum PlayerSkill {
  MAX_HEALTH = 'MAX_HEALTH',
  SPEED = 'SPEED',
  BUILD_AREA = 'BUILD_AREA',
  ASSISTANT = 'ASSISTANT',
}

export enum MovementDirection {
  LEFT = -1,
  RIGHT = 1,
  UP = -1,
  DOWN = 1,
  NONE = 0,
}

export type PlayerData = {
  positionAtMatrix: Vector2D
};

export type PlayerSkillData = {
  label: string
  description: string
  experience: number
  maxLevel: number
  currentLevel?: number
};

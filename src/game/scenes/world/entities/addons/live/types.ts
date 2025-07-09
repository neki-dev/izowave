export enum LiveEvent {
  DEAD = 'dead',
  DAMAGE = 'damage',
  HEAL = 'heal',
  UPDATE_MAX_HEALTH = 'update_max_health',
  UPDATE_HEALTH = 'update_health',
}

export type LiveData = {
  health: number
  maxHealth?: number
  armour?: number
  maxArmour?: number
};

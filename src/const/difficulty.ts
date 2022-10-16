export const DIFFICULTY = {
  PLAYER_SPEED: 100, // Player speed
  PLAYER_HEALTH: 100, // Default player health
  PLAYER_HEALTH_GROWTH: 0.1, // Player health growth by level
  PLAYER_DAMAGE: 15, // Default player damage
  PLAYER_DAMAGE_GROWTH: 0.25, // Player damage growth by level
  PLAYER_ATTACK_DISTANCE: 30, // Player maximum attack distance
  PLAYER_ATTACK_DISTANCE_GROWTH: 0.03, // Attack distance growth
  PLAYER_ATTACK_PAUSE: 700, // Player attack pause
  PLAYER_START_RESOURCES: { bronze: 100, silver: 100, gold: 0 }, // Player start resources

  WAVE_PAUSE: 30000, // Pause in milliseconds between waves
  WAVE_ENEMIES_COUNT: 8, // Enemies count on first wave
  WAVE_ENEMIES_COUNT_GROWTH: 0.5, // Enemies count growth by wave number
  WAVE_ENEMIES_SPAWN_PAUSE: 2300, // Default pause in milliseconds between enemies spawn
  WAVE_ENEMIES_SPAWN_PAUSE_GROWTH: -0.025, // Enemies spawn pause growth by wave number
  WAVE_BOSS_SPAWN_RATE: 5, // Every Nth wave a boss will spawn
  WAVE_EXPERIENCE: 200, // Gained experience per complete wave
  WAVE_EXPERIENCE_GROWTH: 0.1, // Experience count growth by wave number

  EXPERIENCE_TO_NEXT_LEVEL: 300, // Need experience count to next level
  EXPERIENCE_TO_NEXT_LEVEL_GROWTH: 0.3, // Experience count growth by level

  CHEST_EXPERIENCE: 5, // Gained experience per open chest
  CHEST_EXPERIENCE_GROWTH: 0.3, // Experience growth by wave number
  CHEST_RESOURCES: { bronze: 4, silver: 4, gold: 2 }, // Default resources count in chest
  CHEST_RESOURCES_GROWTH: 0.2, // Resources count growth by wave number

  ENEMY_HEALTH_GROWTH: 0.14, // Enemy health growth by wave number
  ENEMY_SPEED_GROWTH: 0.058, // Enemy speed growth by wave number
  ENEMY_DAMAGE_GROWTH: 0.05, // Enemy damage growth by wave number
  ENEMY_KILL_EXPERIENCE: 10, // Gained experience per kill enemy
  ENEMY_KILL_EXPERIENCE_GROWTH: 0.07, // Experience growth by wave number

  BUILDING_ACTION_RADIUS_GROWTH: 0.3, // Actions radius growth by upgrade
  BUILDING_ACTION_PAUSE_GROWTH: -0.1, // Actions pause growth by upgrade
  BUILDING_UPGRADE_EXPERIENCE: 30, // Gained experience per upgrade building
  BUILDING_BUILD_AREA: 180, // Default radius of build area
  BUILDING_BUILD_AREA_GROWTH: 0.05, // Radius growth by level

  AMMUNITION_AMMO: 200, // Maximum amount of ammo
  AMMUNITION_AMMO_UPGRADE: 120, // Amount of ammo added per upgrade
  AMMUNITION_LIMIT: 4, // Maximum count ammunition on world (N * (wave / 5))

  MINE_RESOURCES: 160, // Maximum amount of resources that mine can
  MINE_RESOURCES_UPGRADE: 100, // Amount of resources added per upgrade
  MINE_LIMIT: 4, // Maximum count mines on world (N * (wave / 5))

  TOWER_SHOT_DAMAGE_GROWTH: 0.6, // Shot damage growth by upgrade
  TOWER_SHOT_FREEZE_GROWTH: 0.5, // Frozen duration growth by upgrade
  TOWER_SHOT_SPEED_GROWTH: 0.3, // Shot speed growth by upgrade
  TOWER_AMMO_AMOUNT: 30, // Default shoots in clip

  MEDIC_HEAL_AMOUNT: 10, // Default medic heal
  MEDIC_LIMIT: 1, // Maximum count medic on world (N * (wave / 5))
};

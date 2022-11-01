export const DIFFICULTY = {
  PLAYER_SPEED: 90, // Default player speed
  PLAYER_SPEED_GROWTH: 0.015, // Player speed growth by level
  PLAYER_HEALTH: 100, // Default player health
  PLAYER_HEALTH_GROWTH: 0.1, // Player health growth by level
  PLAYER_START_RESOURCES: 70, // Player start resources
  PLAYER_EXPERIENCE_TO_NEXT_LEVEL: 200, // Need experience count to next level
  PLAYER_EXPERIENCE_TO_NEXT_LEVEL_GROWTH: 0.3, // Experience count growth by level

  ASSISTANT_SPEED: 90, // Default assistant speed
  ASSISTANT_SPEED_GROWTH: 0.015, // Assistant speed growth by player level
  ASSISTANT_HEALTH: 50, // Default assistant health
  ASSISTANT_HEALTH_GROWTH: 0.1, // Assistant health growth by player level
  ASSISTANT_ATTACK_DAMAGE: 15, // Default assistant damage
  ASSISTANT_ATTACK_DAMAGE_GROWTH: 0.2, // Assistant damage growth by player level
  ASSISTANT_ATTACK_SPEED: 500, // Assistant attack speed
  ASSISTANT_ATTACK_SPEED_GROWTH: 0.3, // Attack speed growth by player level
  ASSISTANT_ATTACK_DISTANCE: 70, // Assistant maximum attack distance
  ASSISTANT_ATTACK_DISTANCE_GROWTH: 0.03, // Attack distance growth by player level
  ASSISTANT_ATTACK_PAUSE: 1000, // Assistant attack pause
  ASSISTANT_ATTACK_PAUSE_GROWTH: -0.05, // Attack pause growth by player level

  WAVE_PAUSE: 30000, // Pause in milliseconds between waves
  WAVE_ENEMIES_COUNT: 5, // Enemies count on first wave
  WAVE_ENEMIES_COUNT_GROWTH: 0.5, // Enemies count growth by wave number
  WAVE_ENEMIES_SPAWN_PAUSE: 2300, // Default pause in milliseconds between enemies spawn
  WAVE_ENEMIES_SPAWN_PAUSE_GROWTH: -0.025, // Enemies spawn pause growth by wave number
  WAVE_BOSS_SPAWN_RATE: 5, // Every Nth wave a boss will spawn
  WAVE_EXPERIENCE: 200, // Gained experience per complete wave
  WAVE_EXPERIENCE_GROWTH: 0.1, // Experience count growth by wave number

  CHEST_EXPERIENCE: 8, // Gained experience per open chest
  CHEST_EXPERIENCE_GROWTH: 0.3, // Experience growth by wave number
  CHEST_RESOURCES: 4, // Default resources count in chest
  CHEST_RESOURCES_GROWTH: 0.2, // Resources count growth by wave number

  ENEMY_HEALTH_GROWTH: 0.15, // Enemy health growth by wave number
  ENEMY_SPEED_GROWTH: 0.058, // Enemy speed growth by wave number
  ENEMY_DAMAGE_GROWTH: 0.05, // Enemy damage growth by wave number
  ENEMY_KILL_EXPERIENCE: 10, // Gained experience per kill enemy
  ENEMY_KILL_EXPERIENCE_GROWTH: 0.07, // Experience growth by wave number

  BUILDING_ACTION_RADIUS_GROWTH: 0.2, // Actions radius growth by upgrade
  BUILDING_ACTION_PAUSE_GROWTH: -0.1, // Actions pause growth by upgrade
  BUILDING_UPGRADE_EXPERIENCE: 30, // Gained experience per upgrade building
  BUILDING_BUILD_AREA: 180, // Default radius of build area
  BUILDING_BUILD_AREA_GROWTH: 0.05, // Radius growth by level

  AMMUNITION_AMMO: 200, // Maximum amount of ammo
  AMMUNITION_AMMO_UPGRADE: 120, // Amount of ammo added per upgrade
  AMMUNITION_LIMIT: 4, // Maximum count ammunition on world (N * (wave / 5))

  GENERATOR_RESOURCES: 150, // Maximum amount of resources that generator can
  GENERATOR_RESOURCES_UPGRADE: 100, // Amount of resources added per upgrade
  GENERATOR_LIMIT: 4, // Maximum count generators on world (N * (wave / 5))

  TOWER_SHOT_DAMAGE_GROWTH: 0.6, // Shot damage growth by upgrade
  TOWER_SHOT_FREEZE_GROWTH: 0.5, // Frozen duration growth by upgrade
  TOWER_SHOT_SPEED_GROWTH: 0.3, // Shot speed growth by upgrade
  TOWER_AMMO_AMOUNT: 30, // Default shoots in clip

  MEDIC_HEAL_AMOUNT: 10, // Default medic heal
  MEDIC_LIMIT: 1, // Maximum count medic on world (N * (wave / 5))
};

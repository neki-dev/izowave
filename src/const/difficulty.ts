export const PLAYER_SPEED = 100; // Player speed
export const PLAYER_HEALTH = 100; // Default player health
export const PLAYER_HEALTH_GROWTH = 0.1; // Player health growth by level
export const PLAYER_DAMAGE = 15; // Default player damage
export const PLAYER_DAMAGE_GROWTH = 0.25; // Player damage growth by level
export const PLAYER_ATTACK_DISTANCE = 30; // Player maximum attack distance
export const PLAYER_ATTACK_DISTANCE_GROWTH = 0.03; // Attack distance growth
export const PLAYER_ATTACK_PAUSE = 700; // Player attack pause
export const PLAYER_START_RESOURCES = { bronze: 100, silver: 100, gold: 0 }; // Player start resources

export const WAVE_PAUSE = 30000; // Pause in milliseconds between waves
export const WAVE_ENEMIES_COUNT = 8; // Enemies count on first wave
export const WAVE_ENEMIES_COUNT_GROWTH = 0.6; // Enemies count growth by wave number
export const WAVE_ENEMIES_SPAWN_PAUSE = 2300; // Default pause in milliseconds between enemies spawn
export const WAVE_ENEMIES_SPAWN_PAUSE_GROWTH = -0.025; // Enemies spawn pause growth by wave number
export const WAVE_BOSS_SPAWN_RATE = 5; // Every Nth wave a boss will spawn
export const WAVE_EXPERIENCE = 200; // Gained experience per complete wave
export const WAVE_EXPERIENCE_GROWTH = 0.1; // Experience count growth by wave number

export const EXPERIENCE_TO_NEXT_LEVEL = 300; // Need experience count to next level
export const EXPERIENCE_TO_NEXT_LEVEL_GROWTH = 0.3; // Experience count growth by level

export const CHEST_EXPERIENCE = 5; // Gained experience per open chest
export const CHEST_EXPERIENCE_GROWTH = 0.2; // Experience growth by wave number
export const CHEST_RESOURCES = { bronze: 4, silver: 4, gold: 2 }; // Default resources count in chest
export const CHEST_RESOURCES_GROWTH = 0.1; // Resources count growth by wave number

export const ENEMY_HEALTH_GROWTH = 0.14; // Enemy health growth by wave number
export const ENEMY_SPEED_GROWTH = 0.058; // Enemy speed growth by wave number
export const ENEMY_DAMAGE_GROWTH = 0.05; // Enemy damage growth by wave number
export const ENEMY_KILL_EXPERIENCE = 10; // Gained experience per kill enemy
export const ENEMY_KILL_EXPERIENCE_GROWTH = 0.07; // Experience growth by wave number

export const BUILDING_ACTION_RADIUS_GROWTH = 0.3; // Actions radius growth by upgrade
export const BUILDING_ACTION_PAUSE_GROWTH = -0.1; // Actions pause growth by upgrade
export const BUILDING_UPGRADE_EXPERIENCE = 30; // Gained experience per upgrade building
export const BUILDING_BUILD_AREA = 180; // Default radius of build area
export const BUILDING_BUILD_AREA_GROWTH = 0.05; // Radius growth by level

export const AMMUNITION_AMMO_LIMIT = 200; // Maximum amount of ammo
export const AMMUNITION_AMMO_UPGRADE = 120; // Amount of ammo added per upgrade
export const AMMUNITION_LIMIT = 4; // Maximum count ammunition on world (N * (wave / 5))

export const MINE_RESOURCES_LIMIT = 150; // Maximum amount of resources that mine can
export const MINE_RESOURCES_UPGRADE = 100; // Amount of resources added per upgrade
export const MINE_LIMIT = 4; // Maximum count mines on world (N * (wave / 5))

export const TOWER_SHOT_DAMAGE_GROWTH = 0.6; // Shot damage growth by upgrade
export const TOWER_SHOT_FREEZE_GROWTH = 0.5; // Frozen duration growth by upgrade
export const TOWER_SHOT_SPEED_GROWTH = 0.3; // Shot speed growth by upgrade
export const TOWER_AMMO_AMOUNT = 30; // Default shoots in clip

export const MEDIC_HEAL_AMOUNT = 10; // Default medic heal
export const MEDIC_LIMIT = 1; // Maximum count medic on world (N * (wave / 5))

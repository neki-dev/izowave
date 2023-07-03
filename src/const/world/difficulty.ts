export const DIFFICULTY = {
  /**
   * Player
   */

  PLAYER_START_RESOURCES: 90, // Player resources on game start
  PLAYER_SPEED: 90, // Default player speed
  PLAYER_SPEED_EXPERIENCE_TO_UPGRADE: 100, // Experience need to upgrade player speed (N * upgrade level)
  PLAYER_SPEED_GROWTH: 0.08, // Growth speed by upgrade
  PLAYER_HEALTH: 100, // Default player health
  PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE: 100, // Experience need to upgrade player health (N * upgrade level)
  PLAYER_HEALTH_GROWTH: 0.2, // Growth health by upgrade
  PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH: 0.6, // Growth experience need to upgrade

  /**
   * Assistant
   */

  ASSISTANT_EXPERIENCE_TO_UPGRADE: 100, // Experience need to upgrade assistant (N * upgrade level)
  ASSISTANT_ATTACK_DAMAGE: 15, // Default assistant damage
  ASSISTANT_ATTACK_DAMAGE_GROWTH: 0.2, // Assistant damage growth by upgrade level
  ASSISTANT_ATTACK_SPEED: 500, // Assistant attack speed
  ASSISTANT_ATTACK_SPEED_GROWTH: 0.1, // Attack speed growth by upgrade level
  ASSISTANT_ATTACK_DISTANCE: 70, // Assistant maximum attack distance
  ASSISTANT_ATTACK_DISTANCE_GROWTH: 0.1, // Attack distance growth by upgrade level
  ASSISTANT_ATTACK_PAUSE: 1000, // Assistant attack pause
  ASSISTANT_ATTACK_PAUSE_GROWTH: -0.15, // Attack pause growth by upgrade level

  /**
   * Wave
   */

  WAVE_TIMELEFT: 21000, // Pause in milliseconds between waves
  WAVE_TIMELEFT_GROWTH: 0.15, // Growth pause by wave number
  WAVE_SEASON_LENGTH: 5, // Count of wave numbers in season
  WAVE_ENEMIES_COUNT: 4, // Enemies count on first wave
  WAVE_ENEMIES_COUNT_GROWTH: 0.3, // Enemies count growth by wave number
  WAVE_ENEMIES_SPAWN_PAUSE: 2300, // Default pause in milliseconds between enemies spawn
  WAVE_ENEMIES_SPAWN_PAUSE_GROWTH: -0.025, // Enemies spawn pause growth by wave number
  WAVE_EXPERIENCE: 50, // Gained experience per complete wave
  WAVE_EXPERIENCE_GROWTH: 0.2, // Experience count growth by wave number

  /**
   * Crystals
   */

  CRYSTAL_SPAWN_FACTOR: 0.15, // Crystal spawn factor
  CRYSTAL_RESOURCES: 4, // Default resources count in crystal
  CRYSTAL_RESOURCES_GROWTH: 0.2, // Resources count growth by wave number

  /**
   * Enemies
   */

  ENEMY_HEALTH: 100, // Enemy default health
  ENEMY_HEALTH_GROWTH: 0.25, // Enemy health growth by wave number
  ENEMY_SPEED: 100, // Enemy default speed
  ENEMY_SPEED_GROWTH: 0.1, // Enemy speed growth by wave number
  ENEMY_DAMAGE: 100, // Enemy default damage
  ENEMY_DAMAGE_GROWTH: 0.15, // Enemy damage growth by wave number
  ENEMY_KILL_EXPERIENCE: 10, // Gained experience per kill enemy
  ENEMY_KILL_EXPERIENCE_GROWTH: 0.15, // Experience growth by wave number

  /**
   * Builder
   */

  BUILDER_BUILD_AREA: 180, // Default radius of build area
  BUILDER_BUILD_AREA_EXPERIENCE_TO_UPGRADE: 50, // Experience need to upgrade radius (N * upgrade level)
  BUILDER_BUILD_AREA_GROWTH: 0.1, // Growth radius by upgrade

  /**
   * Buildings
   */

  BUILDING_ACTION_RADIUS_GROWTH: 0.2, // Actions radius growth by upgrade
  BUILDING_ACTION_PAUSE_GROWTH: -0.15, // Actions pause growth by upgrade
  BUILDING_BUILD_EXPERIENCE: 30, // Gained experience for build
  BUILDING_UPGRADE_EXPERIENCE: 20, // Gained experience per upgrade building (N * upgrade level)

  /**
   * Building: Wall
   */

  BUILDING_WALL_COST: 10, // Wall cost
  BUILDING_WALL_HEALTH: 1500, // Wall default health
  BUILDING_WALL_HEALTH_UPGRADE: 2000, // Amount of health added per upgrade (N * upgrade level)

  /**
   * Building: Towers
   */

  BUIDLING_TOWER_SHOT_DAMAGE_GROWTH: 0.6, // Shot damage growth by upgrade
  BUIDLING_TOWER_SHOT_FREEZE_GROWTH: 0.5, // Frozen duration growth by upgrade
  BUIDLING_TOWER_SHOT_SPEED_GROWTH: 0.3, // Shot speed growth by upgrade
  BUIDLING_TOWER_AMMO_AMOUNT: 30, // Ammo in clip (N * upgrade_level)

  /**
   * Building: Tower: Fire
   */

  BUILDING_TOWER_FIRE_COST: 30, // Tower fire cost
  BUILDING_TOWER_FIRE_HEALTH: 600, // Default tower fire health
  BUILDING_TOWER_FIRE_ATTACK_RADIUS: 190, // Tower fire attack radius
  BUILDING_TOWER_FIRE_ATTACK_PAUSE: 1400, // Tower fire pause between attacks
  BUILDING_TOWER_FIRE_ATTACK_DAMAGE: 35, // Tower fire attack damage
  BUILDING_TOWER_FIRE_ATTACK_SPEED: 550, // Tower fire attack speed

  /**
   * Building: Tower: Frozen
   */

  BUILDING_TOWER_FROZEN_COST: 40, // Tower frozen cost
  BUILDING_TOWER_FROZEN_HEALTH: 900, // Default tower frozen health
  BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE: 3, // Minimal wave for allow tower frozen
  BUILDING_TOWER_FROZEN_FREEZE_RADIUS: 180, // Tower frozen freeze radius
  BUILDING_TOWER_FROZEN_FREEZE_PAUSE: 1400, // Tower frozen pause between freezs
  BUILDING_TOWER_FROZEN_FREEZE_DURATION: 900, // Tower frozen freeze duration
  BUILDING_TOWER_FROZEN_FREEZE_SPEED: 550, // Tower frozen freeze speed

  /**
   * Building: Tower: Lazer
   */

  BUILDING_TOWER_LAZER_COST: 70, // Tower lazer cost
  BUILDING_TOWER_LAZER_HEALTH: 300, // Default tower lazer health
  BUILDING_TOWER_LAZER_ALLOW_BY_WAVE: 6, // Minimal wave for allow tower lazer
  BUILDING_TOWER_LAZER_ATTACK_RADIUS: 160, // Tower lazer attack radius
  BUILDING_TOWER_LAZER_ATTACK_PAUSE: 1600, // Tower lazer pause between attacks
  BUILDING_TOWER_LAZER_ATTACK_DAMAGE: 60, // Tower lazer attack damage

  /**
   * Building: Generator
   */

  BUILDING_GENERATOR_COST: 30, // Generator cost
  BUILDING_GENERATOR_HEALTH: 400, // Generator health
  BUILDING_GENERATOR_LIMIT: 4, // Maximum count generators on world (N * wave_season)
  BUILDING_GENERATOR_GENERATE_PAUSE: 1300, // Generator pause between resource generations
  BUILDING_GENERATOR_RESOURCES: 150, // Maximum amount of resources that generator can
  BUILDING_GENERATOR_RESOURCES_UPGRADE: 100, // Amount of resources added per upgrade (N * upgrade_level)

  /**
   * Building: Ammunition
   */

  BUILDING_AMMUNITION_COST: 30, // Ammunition cost
  BUILDING_AMMUNITION_HEALTH: 300, // Ammunition health
  BUILDING_AMMUNITION_LIMIT: 4, // Maximum count ammunition on world (N * wave_season)
  BUILDING_AMMUNITION_ALLOW_BY_WAVE: 3, // Minimal wave for allow ammunition
  BUILDING_AMMUNITION_RELOAD_RADIUS: 150, // Ammunition reload ammo radius
  BUILDING_AMMUNITION_AMMO: 170, // Maximum amount of ammo
  BUILDING_AMMUNITION_AMMO_UPGRADE: 120, // Amount of ammo added per upgrade (N * upgrade_level)

  /**
   * Building: Medic
   */

  BUILDING_MEDIC_COST: 80, // Medic cost
  BUILDING_MEDIC_HEALTH: 150, // Medic health
  BUILDING_MEDIC_LIMIT: 1, // Maximum count medic on world (N * wave_season)
  BUILDING_MEDIC_ALLOW_BY_WAVE: 6, // Minimal wave for allow medic
  BUILDING_MEDIC_HEAL_RADIUS: 160, // Medic heal radius
  BUILDING_MEDIC_HEAL_PAUSE: 3000, // Medic heal pause
  BUILDING_MEDIC_HEAL_AMOUNT: 10, // Default medic heal
  BUILDING_MEDIC_HEAL_AMOUNT_UPGRADE: 10, // Amount of heal added per upgrade (N * upgrade_level)
};

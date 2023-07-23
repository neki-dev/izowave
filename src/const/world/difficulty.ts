export const DIFFICULTY = {
  /**
   * Player
   */

  PLAYER_START_RESOURCES: 80, // Resources on game start
  PLAYER_SPEED: 90, // Movement speed
  PLAYER_SPEED_GROWTH: 0.08, // Growth speed by upgrade (Quadratic)
  PLAYER_SPEED_EXPERIENCE_TO_UPGRADE: 100, // Experience need to upgrade speed
  PLAYER_HEALTH: 100, // Health
  PLAYER_HEALTH_GROWTH: 0.4, // Growth health by upgrade (Quadratic)
  PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE: 80, // Experience need to upgrade
  PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH: 0.6, // Growth experience need to upgrade (Quadratic)

  /**
   * Assistant
   */

  ASSISTANT_EXPERIENCE_TO_UPGRADE: 120, // Experience need to upgrade
  ASSISTANT_ATTACK_DAMAGE: 15, // Attack damage
  ASSISTANT_ATTACK_DAMAGE_GROWTH: 0.5, // Damage growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_SPEED: 500, // Attack speed
  ASSISTANT_ATTACK_SPEED_GROWTH: 0.1, // Attack speed growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_DISTANCE: 70, // Attack distance
  ASSISTANT_ATTACK_DISTANCE_GROWTH: 0.1, // Attack distance growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_PAUSE: 1000, // Attack pause
  ASSISTANT_ATTACK_PAUSE_GROWTH: -0.15, // Attack pause growth by upgrade level (Quadratic)

  /**
   * Features
   */

  FEATURE_FROST_COST: 50, // Cost of use
  FEATURE_FROST_DURATION: 6000, // Feature duration
  FEATURE_RAGE_COST: 70, // Cost of use
  FEATURE_RAGE_DURATION: 8000, // Feature duration
  FEATURE_SHIELD_COST: 40, // Cost of use
  FEATURE_SHIELD_DURATION: 8000, // Feature duration
  FEATURE_FIRE_COST: 80, // Cost of use
  FEATURE_FIRE_DURATION: 1000, // Feature duration
  FEATURE_COST_GROWTH: 0.1, // Growth cost by wave number (Linear)

  /**
   * Wave
   */

  WAVE_TIMELEFT: 10000, // Pause between waves
  WAVE_TIMELEFT_GROWTH: 0.5, // Pause growth by wave number (Linear)
  WAVE_SEASON_LENGTH: 5, // Count of wave numbers in season
  WAVE_ENEMIES_COUNT: 4, // Enemies count on first wave
  WAVE_ENEMIES_COUNT_GROWTH: 0.27, // Enemies count growth by wave number (Quadratic Force)
  WAVE_ENEMIES_SPAWN_PAUSE: 2300, // Pause between enemies spawn
  WAVE_ENEMIES_SPAWN_PAUSE_GROWTH: -0.035, // Enemies spawn pause growth by wave number (Quadratic)
  WAVE_EXPERIENCE: 50, // Gained experience per complete wave
  WAVE_EXPERIENCE_GROWTH: 0.2, // Experience amount growth by wave number (Quadratic)

  /**
   * Crystals
   */

  CRYSTAL_SPAWN_FACTOR: 0.15, // Crystal spawn factor
  CRYSTAL_RESOURCES: 4, // Resources in crystal
  CRYSTAL_RESOURCES_GROWTH: 0.2, // Resources amount growth by wave number (Quadratic)

  /**
   * Enemies
   */

  ENEMY_HEALTH: 85, // Health
  ENEMY_HEALTH_GROWTH: 0.36, // Health growth by wave number (Quadratic)
  ENEMY_SPEED: 100, // Movement speed
  ENEMY_SPEED_GROWTH: 0.08, // Speed growth by wave number (Quadratic)
  ENEMY_DAMAGE: 90, // Attack damage
  ENEMY_DAMAGE_GROWTH: 0.17, // Damage growth by wave number (Quadratic)
  ENEMY_KILL_EXPERIENCE: 10, // Gained experience per kill enemy
  ENEMY_KILL_EXPERIENCE_GROWTH: 0.15, // Experience growth by wave number (Quadratic)

  /**
   * Builder
   */

  BUILDER_BUILD_AREA: 140, // Radius of build area
  BUILDER_BUILD_AREA_GROWTH: 0.13, // Growth radius by upgrade (Quadratic)
  BUILDER_BUILD_AREA_EXPERIENCE_TO_UPGRADE: 100, // Experience need to upgrade radius

  /**
   * Buildings
   */

  BUILDING_ACTION_RADIUS_GROWTH: 0.2, // Actions radius growth by level (Quadratic)
  BUILDING_ACTION_PAUSE_GROWTH: -0.15, // Actions pause growth by level (Quadratic)
  BUILDING_BUILD_EXPERIENCE: 30, // Gained experience for build
  BUILDING_UPGRADE_EXPERIENCE: 15, // Gained experience per upgrade level
  BUILDING_UPGRADE_EXPERIENCE_GROWTH: 0.75, // Experience growth by level (Linear)

  /**
   * Building: Wall
   */

  BUILDING_WALL_COST: 10, // Building cost
  BUILDING_WALL_ALLOW_BY_WAVE: 2, // Minimal wave for allow build
  BUILDING_WALL_HEALTH: 1500, // Health
  BUILDING_WALL_HEALTH_GROWTH: 1.2, // Health growth by level (Linear)

  /**
   * Building: Towers
   */

  BUIDLING_TOWER_SHOT_DAMAGE_GROWTH: 0.5, // Shot damage growth by level (Quadratic)
  BUIDLING_TOWER_SHOT_FREEZE_GROWTH: 0.5, // Frozen duration growth by level (Quadratic)
  BUIDLING_TOWER_SHOT_SPEED_GROWTH: 0.25, // Shot speed growth by level (Quadratic)
  BUIDLING_TOWER_AMMO_AMOUNT: 30, // Ammo in clip

  /**
   * Building: Tower: Fire
   */

  BUILDING_TOWER_FIRE_COST: 30, // Building cost
  BUILDING_TOWER_FIRE_HEALTH: 600, // Health
  BUILDING_TOWER_FIRE_ATTACK_RADIUS: 170, // Attack radius
  BUILDING_TOWER_FIRE_ATTACK_PAUSE: 1400, // Pause between attacks
  BUILDING_TOWER_FIRE_ATTACK_DAMAGE: 40, // Attack damage
  BUILDING_TOWER_FIRE_ATTACK_SPEED: 550, // Attack speed

  /**
   * Building: Tower: Frozen
   */

  BUILDING_TOWER_FROZEN_COST: 40, // Building cost
  BUILDING_TOWER_FROZEN_HEALTH: 800, // Health
  BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE: 3, // Minimal wave for allow build
  BUILDING_TOWER_FROZEN_FREEZE_RADIUS: 160, // Freeze radius
  BUILDING_TOWER_FROZEN_FREEZE_PAUSE: 1400, // Pause between freezes
  BUILDING_TOWER_FROZEN_FREEZE_DURATION: 900, // Freeze duration
  BUILDING_TOWER_FROZEN_FREEZE_SPEED: 550, // Freeze speed

  /**
   * Building: Tower: Lazer
   */

  BUILDING_TOWER_LAZER_COST: 80, // Building cost
  BUILDING_TOWER_LAZER_HEALTH: 300, // Health
  BUILDING_TOWER_LAZER_ALLOW_BY_WAVE: 6, // Minimal wave for allow build
  BUILDING_TOWER_LAZER_ATTACK_RADIUS: 140, // Attack radius
  BUILDING_TOWER_LAZER_ATTACK_PAUSE: 1600, // Pause between attacks
  BUILDING_TOWER_LAZER_ATTACK_DAMAGE: 60, // Attack damage

  /**
   * Building: Generator
   */

  BUILDING_GENERATOR_COST: 30, // Building cost
  BUILDING_GENERATOR_HEALTH: 400, // Health
  BUILDING_GENERATOR_LIMIT: 1.0, // Factor of generator limit
  BUILDING_GENERATOR_GENERATE_PAUSE: 1300, // Pause between resource generations
  BUILDING_GENERATOR_RESOURCES: 150, // Resources amount
  BUILDING_GENERATOR_RESOURCES_GROWTH: 0.5, // Resources amount growth by level (Linear From)

  /**
   * Building: Ammunition
   */

  BUILDING_AMMUNITION_COST: 30, // Building cost
  BUILDING_AMMUNITION_HEALTH: 300, // Health
  BUILDING_AMMUNITION_LIMIT: 1.0, // Factor of ammunition limit
  BUILDING_AMMUNITION_ALLOW_BY_WAVE: 2, // Minimal wave for allow build
  BUILDING_AMMUNITION_RELOAD_RADIUS: 150, // Reload ammo radius
  BUILDING_AMMUNITION_AMMO: 150, // Ammo amount
  BUILDING_AMMUNITION_AMMO_GROWTH: 0.5, // Ammo amount growth by level (Linear From)

  /**
   * Building: Medic
   */

  BUILDING_MEDIC_COST: 70, // Building cost
  BUILDING_MEDIC_HEALTH: 200, // Health
  BUILDING_MEDIC_LIMIT: 0.5, // Factor of medic limit
  BUILDING_MEDIC_ALLOW_BY_WAVE: 8, // Minimal wave for allow build
  BUILDING_MEDIC_HEAL_RADIUS: 160, // Heal radius
  BUILDING_MEDIC_HEAL_PAUSE: 3000, // Heal pause
  BUILDING_MEDIC_HEAL_AMOUNT: 20, // Heal amount
  BUILDING_MEDIC_HEAL_AMOUNT_GROWTH: 2.5, // Heal amount growth by level (Linear)
};

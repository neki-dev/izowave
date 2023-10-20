export const DIFFICULTY = {
  /**
   * Player
   */

  PLAYER_START_RESOURCES: 70, // Resources on game start
  PLAYER_HEALTH: 100, // Health
  PLAYER_HEALTH_GROWTH: 0.4, // Growth health by upgrade (Quadratic)
  PLAYER_HEALTH_EXPERIENCE_TO_UPGRADE: 80, // Experience need to upgrade health
  PLAYER_SPEED: 90, // Movement speed
  PLAYER_SPEED_GROWTH: 0.04, // Growth speed by upgrade (Quadratic)
  PLAYER_SPEED_EXPERIENCE_TO_UPGRADE: 60, // Experience need to upgrade speed
  PLAYER_STAMINA: 100, // Stamina
  PLAYER_STAMINA_GROWTH: 0.2, // Growth stamina by upgrade (Quadratic)
  PLAYER_STAMINA_EXPERIENCE_TO_UPGRADE: 60, //  Experience need to upgrade stamina
  PLAYER_EXPERIENCE_TO_UPGRADE_GROWTH: 0.6, // Growth experience need to upgrade (Quadratic)

  /**
   * Assistant
   */

  ASSISTANT_EXPERIENCE_TO_UPGRADE: 100, // Experience need to upgrade
  ASSISTANT_ATTACK_DAMAGE: 15, // Attack damage
  ASSISTANT_ATTACK_DAMAGE_GROWTH: 0.55, // Damage growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_DAMAGE_EXPERIENCE_TO_UPGRADE: 60, // Experience need to upgrade attack damage
  ASSISTANT_ATTACK_SPEED: 500, // Attack speed
  ASSISTANT_ATTACK_SPEED_GROWTH: 0.1, // Attack speed growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_DISTANCE: 70, // Attack distance
  ASSISTANT_ATTACK_DISTANCE_GROWTH: 0.15, // Attack distance growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_DISTANCE_EXPERIENCE_TO_UPGRADE: 40, // Experience need to upgrade attack distance
  ASSISTANT_ATTACK_PAUSE: 1000, // Attack pause
  ASSISTANT_ATTACK_PAUSE_GROWTH: -0.15, // Attack pause growth by upgrade level (Quadratic)
  ASSISTANT_ATTACK_SPEED_EXPERIENCE_TO_UPGRADE: 40, // Experience need to upgrade attack speed

  /**
   * Superskills
   */

  SUPERSKILL_FROST_COST: 40, // Cost of use
  SUPERSKILL_FROST_DURATION: 6000, // Frost duration
  SUPERSKILL_SHIELD_COST: 40, // Cost of use
  SUPERSKILL_SHIELD_DURATION: 10000, // Shield duration
  SUPERSKILL_RAGE_COST: 60, // Cost of use
  SUPERSKILL_RAGE_DURATION: 10000, // Rage duration
  SUPERSKILL_FIRE_COST: 60, // Cost of use
  SUPERSKILL_FIRE_DURATION: 1000, // Fire duration
  SUPERSKILL_FIRE_DAMAGE: 50, // Fire damage
  SUPERSKILL_FIRE_DAMAGE_GROWTH: 0.35, // Growth damage by wave number (Quadratic)
  SUPERSKILL_FIRE_DAMAGE_GROWTH_RETARDATION_LEVEL: 12, // Level for damage growth retardation
  SUPERSKILL_COST_GROWTH: 0.15, // Growth cost by wave number (Linear)

  /**
   * Wave
   */

  WAVE_TIMELEFT: 10000, // Pause between waves
  WAVE_TIMELEFT_GROWTH: 0.5, // Pause growth by wave number (Linear)
  WAVE_ENEMIES_COUNT: 4, // Enemies count on first wave
  WAVE_ENEMIES_COUNT_GROWTH: 0.27, // Enemies count growth by wave number (Quadratic Mixed)
  WAVE_ENEMIES_SPAWN_PAUSE: 2200, // Pause between enemies spawn
  WAVE_ENEMIES_SPAWN_PAUSE_GROWTH: -0.038, // Enemies spawn pause growth by wave number (Quadratic)
  WAVE_ENEMIES_SPAWN_PAUSE_LEVEL: 20, // Level for limit spawn pause growth
  WAVE_EXPERIENCE: 50, // Gained experience per complete wave
  WAVE_EXPERIENCE_GROWTH: 0.2, // Experience amount growth by wave number (Quadratic)

  /**
   * Ads reward
   */

  ADS_REWARD_EXPERIENCE: 400, // Gained experience by show ads (per wave number)
  ADS_REWARD_RESOURCES: 20, // Gained resources by show ads (per wave number)
  ADS_REWARD_FREQUENCY: 2, // Show per wave number
  ADS_REWARD_MIN_WAVE: 3, // Min wave number to show

  /**
   * Crystals
   */

  CRYSTAL_COUNT: 6, // Crystal spawn factor
  CRYSTAL_COUNT_GROWTH: 0.17, // Count growth by wave number (Linear)
  CRYSTAL_COUNT_GROWTH_MAX_LEVEL: 10, // Level for limit count growth
  CRYSTAL_RESOURCES: 4, // Resources in crystal
  CRYSTAL_RESOURCES_GROWTH: 0.8, // Resources amount growth by wave number (Linear)

  /**
   * Enemies
   */

  ENEMY_HEALTH: 60, // Health
  ENEMY_HEALTH_GROWTH: 0.35, // Health growth by wave number (Quadratic)
  ENEMY_HEALTH_GROWTH_RETARDATION_LEVEL: 12, // Level for health growth retardation
  ENEMY_ARMOUR: 60, // Armour
  ENEMY_ARMOUR_GROWTH: 0.4, // Armour growth by wave number (Quadratic)
  ENEMY_ARMOUR_GROWTH_RETARDATION_LEVEL: 12, // Level for armour growth retardation
  ENEMY_SPEED: 60, // Movement speed
  ENEMY_SPEED_GROWTH: 0.08, // Speed growth by wave number (Linear)
  ENEMY_SPEED_GROWTH_MAX_LEVEL: 15, // Level for limit speed growth
  ENEMY_DAMAGE: 90, // Attack damage
  ENEMY_DAMAGE_GROWTH: 0.32, // Damage growth by wave number (Linear)
  ENEMY_KILL_EXPERIENCE: 10, // Gained experience per kill enemy
  ENEMY_KILL_EXPERIENCE_GROWTH: 0.15, // Experience growth by wave number (Quadratic)

  /**
   * Builder
   */

  BUILDER_BUILD_DURATION: 2500, // Duration of build process
  BUILDER_BUILD_DURATION_GROWTH: -0.112, // Experience growth by level (Linear)
  BUILDER_BUILD_SPEED_EXPERIENCE_TO_UPGRADE: 40, // Experience need to upgrade speed

  /**
   * Buildings
   */

  BUILDING_HEALTH_GROWTH: 1.0, // Health growth by level (Quadratic)
  BUILDING_BUILD_EXPERIENCE: 30, // Gained experience for build
  BUILDING_UPGRADE_EXPERIENCE: 15, // Gained experience per upgrade level
  BUILDING_UPGRADE_EXPERIENCE_GROWTH: 0.75, // Experience growth by level (Linear)
  BUILDING_UPGRADE_COST_MULTIPLIER: 0.5, // Upgrade cost multiplier
  BUILDING_REPAIR_COST_MULTIPLIER: 0.75, // Repair cost multiplier

  /**
   * Building: Wall
   */

  BUILDING_WALL_COST: 10, // Building cost
  BUILDING_WALL_ALLOW_BY_WAVE: 2, // Minimal wave for allow build
  BUILDING_WALL_HEALTH: 2000, // Health

  /**
   * Building: Towers
   */

  BUIDLING_TOWER_SHOT_DAMAGE_GROWTH: 0.85, // Shot damage growth by level (Linear)
  BUIDLING_TOWER_SHOT_FREEZE_GROWTH: 0.5, // Frozen duration growth by level (Lienear)
  BUIDLING_TOWER_SHOT_SPEED_GROWTH: 0.2, // Shot speed growth by level (Linear)
  BUIDLING_TOWER_AMMO_AMOUNT: 30, // Ammo in clip

  /**
   * Building: Tower: Fire
   */

  BUILDING_TOWER_FIRE_COST: 30, // Building cost
  BUILDING_TOWER_FIRE_HEALTH: 300, // Health
  BUILDING_TOWER_FIRE_RADIUS: 160, // Attack radius
  BUILDING_TOWER_FIRE_RADIUS_GROWTH: 0.2, // Radius growth by level (Linear)
  BUILDING_TOWER_FIRE_DELAY: 1400, // Pause between attacks
  BUILDING_TOWER_FIRE_DELAY_GROWTH: -0.12, // Pause growth by level (Linear)
  BUILDING_TOWER_FIRE_DAMAGE: 40, // Attack damage
  BUILDING_TOWER_FIRE_SHOT_SPEED: 300, // Shot speed

  /**
   * Building: Tower: Frozen
   */

  BUILDING_TOWER_FROZEN_COST: 40, // Building cost
  BUILDING_TOWER_FROZEN_HEALTH: 400, // Health
  BUILDING_TOWER_FROZEN_ALLOW_BY_WAVE: 3, // Minimal wave for allow build
  BUILDING_TOWER_FROZEN_RADIUS: 150, // Freeze radius
  BUILDING_TOWER_FROZEN_RADIUS_GROWTH: 0.2, // Radius growth by level (Linear)
  BUILDING_TOWER_FROZEN_DELAY: 1400, // Pause between freezes
  BUILDING_TOWER_FROZEN_DELAY_GROWTH: -0.12, // Pause growth by level (Linear)
  BUILDING_TOWER_FROZEN_FREEZE_DURATION: 800, // Freeze duration
  BUILDING_TOWER_FROZEN_SHOT_SPEED: 300, // Shot speed

  /**
   * Building: Tower: Laser
   */

  BUILDING_TOWER_LAZER_COST: 80, // Building cost
  BUILDING_TOWER_LAZER_HEALTH: 200, // Health
  BUILDING_TOWER_LAZER_ALLOW_BY_WAVE: 6, // Minimal wave for allow build
  BUILDING_TOWER_LAZER_RADIUS: 140, // Attack radius
  BUILDING_TOWER_LAZER_RADIUS_GROWTH: 0.2, // Radius growth by level (Linear)
  BUILDING_TOWER_LAZER_DELAY: 1300, // Pause between attacks
  BUILDING_TOWER_LAZER_DELAY_GROWTH: -0.14, // Pause growth by level (Linear)
  BUILDING_TOWER_LAZER_DAMAGE: 65, // Attack damage

  /**
   * Building: Generator
   */

  BUILDING_GENERATOR_COST: 20, // Building cost
  BUILDING_GENERATOR_HEALTH: 200, // Health
  BUILDING_GENERATOR_DELAY: 1300, // Pause between resource generations
  BUILDING_GENERATOR_DELAY_GROWTH: -0.153, // Pause growth by level (Linear)

  /**
   * Building: Ammunition
   */

  BUILDING_AMMUNITION_COST: 40, // Building cost
  BUILDING_AMMUNITION_HEALTH: 600, // Health
  BUILDING_AMMUNITION_ALLOW_BY_WAVE: 3, // Minimal wave for allow build
  BUILDING_AMMUNITION_RADIUS: 120, // Heal radius
  BUILDING_AMMUNITION_RADIUS_GROWTH: 0.33, // Radius growth by level (Linear)
  BUILDING_AMMUNITION_AMMO: 120, // Ammo amount
  BUILDING_AMMUNITION_AMMO_GROWTH: 1.0, // Ammo amount growth by level (Quadratic)

  /**
   * Building: Radar
   */

  BUILDING_RADAR_COST: 60, // Building cost
  BUILDING_RADAR_HEALTH: 400, // Health
  BUILDING_RADAR_ALLOW_BY_WAVE: 8, // Minimal wave for allow build
  BUILDING_RADAR_RADIUS: 140, // Unhidden radius
  BUILDING_RADAR_RADIUS_GROWTH: 0.3, // Radius growth by level (Linear)

  /**
   * Building: Booster
   */

  BUILDING_BOOSTER_COST: 80, // Building cost
  BUILDING_BOOSTER_ALLOW_BY_WAVE: 6, // Minimal wave for allow build
  BUILDING_BOOSTER_HEALTH: 600, // Health
  BUILDING_BOOSTER_RADIUS: 80, // Increase radius
  BUILDING_BOOSTER_RADIUS_GROWTH: 0.2, // Radius growth by level (Linear)
  BUILDING_BOOSTER_POWER: 10, // Power multiplier
  BUILDING_BOOSTER_POWER_GROWTH: 1.0, // Multiplier growth by level (Linear)
};

import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import Chest from '~scene/world/entities/chest';
import Enemy from '~scene/world/entities/enemy';
import Sprite from '~scene/world/entities/sprite';
import World from '~scene/world';

import {
  PlayerEvents, PlayerTexture,
  MovementDirection, MovementDirectionValue, PlayerStat,
} from '~type/player';
import { WorldEffect } from '~type/world';
import { BiomeType, TileType } from '~type/level';
import { ResourceType, Resources } from '~type/building';
import { LiveEvents } from '~type/live';
import { NoticeType } from '~type/interface';

import { WORLD_CAMERA_ZOOM } from '~const/world';
import {
  PLAYER_RECORD_KEY, PLAYER_TILE_SIZE, PLAYER_MOVE_DIRECTIONS,
} from '~const/player';
import {
  EXPERIENCE_TO_NEXT_LEVEL, EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
  PLAYER_HEALTH, PLAYER_HEALTH_GROWTH,
  PLAYER_START_RESOURCES,
  PLAYER_SPEED,
  PLAYER_DAMAGE, PLAYER_DAMAGE_GROWTH,
  PLAYER_ATTACK_DISTANCE, PLAYER_ATTACK_DISTANCE_GROWTH,
  PLAYER_ATTACK_PAUSE,
} from '~const/difficulty';
import { LEVEL_MAP_VISITED_TILE_TINT } from '~const/level';
import { INPUT_KEY } from '~const/keyboard';

export default class Player extends Sprite {
  /**
   * Player level.
   */
  private _level: number = 1;

  public get level() { return this._level; }

  private set level(v) { this._level = v; }

  /**
   * Player experience on current level.
   */
  private _experience: number = 0;

  public get experience() { return this._experience; }

  private set experience(v) { this._experience = v; }

  /**
   * Resourse amounts.
   */
  private _resources: Resources = PLAYER_START_RESOURCES;

  public get resources() { return this._resources; }

  private set resources(v) { this._resources = v; }

  /**
   * Total number of enemies killed.
   */
  private kills: number = 0;

  /**
   * Keyboard keys.
   */
  private cursors: {
    [key: string]: Phaser.Input.Keyboard.Key
  };

  /**
   * Current direction in deg.
   */
  private direction: number = 0;

  /**
   * Move direction.
   */
  private moveDirection: MovementDirection = {
    x: MovementDirectionValue.NONE,
    y: MovementDirectionValue.NONE,
  };

  /**
   * State of move blocking.
   */
  private isBlocked: boolean = false;

  /**
   * Pause for attacks.
   */
  private attackPause: number = 0;

  /**
   *
   */
  private tile?: Phaser.GameObjects.Image;

  /**
   * Player constructor.
   */
  constructor(scene: World, positionAtMatrix: Phaser.Types.Math.Vector2Like) {
    super(scene, {
      texture: PlayerTexture.PLAYER,
      positionAtMatrix,
      health: PLAYER_HEALTH,
    });
    scene.add.existing(this);

    // Configure physics
    this.body.setCircle(3, 5, 10);
    this.setScale(2.0);
    this.setPushable(false);
    this.setOrigin(0.5, 0.75);

    this.makeAnimations();
    this.registerKeyboard();

    // Add events callbacks
    this.live.on(LiveEvents.DEAD, () => this.onDead());
    this.live.on(LiveEvents.DAMAGE, () => this.onDamage());
  }

  /**
   * Update event.
   * Update direction, velocity and health indicator.
   */
  public update() {
    if (this.isBlocked) {
      return;
    }

    super.update();

    this.updateDirection();
    this.updateVelocity();

    // Add visited way
    this.tile = this.scene.level.getTile({ ...this.positionAtMatrix, z: 0 });
    if ([BiomeType.SAND, BiomeType.GRASS].includes(this.tile?.biome.type)) {
      this.tile.setTint(LEVEL_MAP_VISITED_TILE_TINT);
    }
  }

  /**
   * Give player experince.
   * If enough experience, the level will be increased.
   *
   * @param amount - Amount
   */
  public giveExperience(amount: number) {
    if (this.live.isDead()) {
      return;
    }

    this.experience += amount;
    this.emit(PlayerEvents.EXPERIENCE, amount);

    const calc = (level: number) => calcGrowth(
      EXPERIENCE_TO_NEXT_LEVEL,
      EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
      this.level + level + 1,
    );

    let experienceNeed = calc(0);
    let experienceLeft = this.experience;
    let level = 0;
    while (experienceLeft >= experienceNeed) {
      level++;
      experienceLeft -= experienceNeed;
      experienceNeed = calc(level);
    }

    if (level > 0) {
      this.experience = experienceLeft;
      this.nextLevel(level);
    }
  }

  /**
   * Give player resources.
   *
   * @param amounts - Resources amounts
   */
  public giveResources(amounts: Resources) {
    if (this.live.isDead()) {
      return;
    }

    for (const [type, amount] of Object.entries(amounts)) {
      if (amount > 0) {
        this.resources[type] += amount;
        this.emit(PlayerEvents.RESOURCE, type, amount);
      }
    }
  }

  /**
   * Check if player have resources.
   *
   * @param amounts - Resources amounts
   */
  public haveResources(amounts: Resources): boolean {
    for (const type in amounts) {
      if (this.resources[type] < amounts[type]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Take player resources.
   *
   * @param amounts - Resources amounts
   */
  public takeResources(amounts: Resources): void {
    for (const [type, amount] of Object.entries(amounts)) {
      if (amount > 0) {
        this.resources[type] -= amount;
        this.emit(PlayerEvents.RESOURCE, type, -amount);
      }
    }
  }

  /**
   * Get resource amount.
   *
   * @param type - Resource type
   */
  public getResource(type: ResourceType): number {
    return this.resources[type];
  }

  /**
   * Inremeting number of enemies killed.
   */
  public incrementKills() {
    this.kills++;
  }

  /**
   * Blocking player movement.
   */
  public freeze() {
    this.stop();
    this.isBlocked = true;
    this.setVelocity(0, 0);
  }

  /**
   * Unblocking player movement.
   */
  public unfreeze() {
    this.isBlocked = false;
    this.updateDirection();
  }

  /**
   * Upgrade player to next level.
   *
   * @param count - Levels count
   */
  private nextLevel(count: number) {
    this.level += count;

    // Update maximum player health by level
    const maxHealth = calcGrowth(PLAYER_HEALTH, PLAYER_HEALTH_GROWTH, this.level);
    this.live.setMaxHealth(maxHealth);
    this.live.heal();

    this.scene.screen.message(NoticeType.INFO, 'LEVEL UP');
  }

  /**
   * Player dead event.
   */
  private onDead() {
    this.freeze();

    const camera = this.scene.cameras.main;
    camera.stopFollow();
    camera.zoomTo(WORLD_CAMERA_ZOOM * 2, 10 * 1000);

    const record = this.readBestStat();
    const stat = this.getStat();
    this.writeBestStat(stat, record);

    this.scene.tweens.add({
      targets: [this, this.container],
      alpha: 0.0,
      duration: 250,
      onComplete: () => {
        this.scene.finishGame(stat, record);
      },
    });
  }

  /**
   * Player damage event.
   */
  private onDamage() {
    this.scene.effects.emit(WorldEffect.BLOOD, this, {
      follow: this,
      lifespan: { min: 100, max: 200 },
      scale: { start: 1.0, end: 0.5 },
      frequency: 2,
      speed: 100,
      maxParticles: 6,
    }, 200);
  }

  /**
   * Bind keyboard keys for movement and attack.
   */
  private registerKeyboard() {
    const { keyboard } = this.scene.input;

    const movementKeys = 'W,A,S,D,UP,LEFT,DOWN,RIGHT';
    this.cursors = <{
      [key: string]: Phaser.Input.Keyboard.Key
    }> keyboard.addKeys(movementKeys);

    for (const KEY of INPUT_KEY.PLAYER_ATTACK) {
      keyboard.on(KEY, this.attack, this);
    }
  }

  /**
   * Give damage to nearby targets
   * and add effect.
   */
  private attack() {
    if (this.live.isDead()) {
      return;
    }

    const now = this.scene.getTimerNow();
    if (this.attackPause > now) {
      return;
    }

    const damage = calcGrowth(PLAYER_DAMAGE, PLAYER_DAMAGE_GROWTH, this.level);
    const distance = calcGrowth(PLAYER_ATTACK_DISTANCE, PLAYER_ATTACK_DISTANCE_GROWTH, this.level);
    const offset = this.scene.physics.velocityFromAngle(this.direction, distance);
    const area = new Phaser.Geom.Circle(this.x + offset.x, this.y + offset.y, distance);
    this.scene.enemies.children.iterate((enemy: Enemy) => {
      if (area.contains(enemy.x, enemy.y)) {
        enemy.live.damage(damage);
      }
    });

    this.scene.effects.emit(WorldEffect.GLOW, this, {
      follow: this,
      followOffset: offset,
      scale: { start: 0.3, end: 0.1, ease: 'Power3' },
      angle: this.direction + 180,
      lifespan: { min: 100, max: 300 },
      speed: { min: 150, max: 300 },
      frequency: 2,
      quantity: 2,
      maxParticles: 16,
      blendMode: 'ADD',
      emitZone: { source: new Phaser.Geom.Circle(0, 0, distance / 3), type: 'random' },
    }, 300);

    this.attackPause = now + PLAYER_ATTACK_PAUSE;
  }

  /**
   * Get player speed relative to friction force of current biome.
   */
  private getSpeed(): number {
    const speed = PLAYER_SPEED + (this.level - 1) * 1.5;
    return speed / (this.tile ? this.tile.biome.friction : 1);
  }

  /**
   * Update player velocity.
   */
  private updateVelocity() {
    const { x: dX, y: dY } = this.moveDirection;
    if (dX === 0 && dY === 0) {
      this.setVelocity(0, 0);
      return;
    }

    const collide = this.handleCollide();
    if (collide) {
      this.setVelocity(0, 0);
      return;
    }

    const { x, y } = this.scene.physics.velocityFromAngle(this.direction, this.getSpeed());
    this.setVelocity(x, y);
  }

  /**
   * Update move direction and animation.
   */
  private updateDirection() {
    const animation = [];
    const x = this.getSingleDirection([['LEFT', 'A'], ['RIGHT', 'D']], animation);
    const y = this.getSingleDirection([['UP', 'W'], ['DOWN', 'S']], animation);

    if (x !== 0 || y !== 0) {
      this.direction = PLAYER_MOVE_DIRECTIONS[`${x}|${y}`];
    }

    if (this.moveDirection.x !== x || this.moveDirection.y !== y) {
      this.moveDirection = { x, y };

      if (animation.length > 0) {
        this.play(`run_${animation.join('_')}`);
      } else {
        this.stop();
      }
    }
  }

  /**
   * Get and handle collides.
   */
  private handleCollide(): boolean {
    const tile = this.getCollide(this.direction, [
      TileType.MAP,
      TileType.BUILDING,
      TileType.CHEST,
    ]);

    if (tile instanceof Chest) {
      tile.open();
    }

    return Boolean(tile);
  }

  /**
   * Get single move direction by keys state.
   *
   * @param keys - Positive and negative keys
   * @param animation - Animation buffer
   */
  private getSingleDirection(keys: string[][], animation: string[]): MovementDirectionValue {
    for (const dir of keys) {
      const [core, alias] = dir;
      if (this.cursors[core].isDown || this.cursors[alias].isDown) {
        animation?.push(core);
        return MovementDirectionValue[core];
      }
    }

    return MovementDirectionValue.NONE;
  }

  /**
   * Get current game stat.
   */
  private getStat(): PlayerStat {
    const { wave } = this.scene;
    return {
      waves: wave.isGoing ? wave.number - 1 : wave.number,
      kills: this.kills,
      level: this.level,
      lived: this.scene.getTimerNow() / 1000 / 60,
    };
  }

  /**
   * Get and save current game stat.
   */
  private readBestStat(): PlayerStat {
    const recordValue = localStorage.getItem(`${PLAYER_RECORD_KEY}.${this.scene.difficultyType}`);
    return recordValue ? JSON.parse(recordValue) : {};
  }

  /**
   * Get and save current game stat.
   */
  private writeBestStat(stat: PlayerStat, record: PlayerStat) {
    localStorage.setItem(`${PLAYER_RECORD_KEY}.${this.scene.difficultyType}`, JSON.stringify(
      Object.keys(stat).reduce((curr, param) => ({
        ...curr,
        [param]: Math.max(stat[param], record[param] || 0),
      }), {}),
    ));
  }

  /**
   * Add animations for all move directions.
   */
  private makeAnimations() {
    const { anims } = this.scene;

    let frameIndex = 0;
    for (const dirH of ['LEFT', '', 'RIGHT']) {
      for (const dirV of ['UP', '', 'DOWN']) {
        if (dirH || dirV) {
          anims.create({
            key: `run_${[dirH, dirV].filter((d) => d).join('_')}`,
            frames: anims.generateFrameNumbers(PlayerTexture.PLAYER, {
              start: frameIndex * 4,
              end: (frameIndex + 1) * 4 - 1,
            }),
            frameRate: 8,
            repeat: -1,
          });
          frameIndex++;
        }
      }
    }
  }
}

registerAssets([{
  key: PlayerTexture.PLAYER,
  type: 'spritesheet',
  url: `assets/sprites/${PlayerTexture.PLAYER}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: PLAYER_TILE_SIZE,
    frameHeight: PLAYER_TILE_SIZE,
  },
}]);

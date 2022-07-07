import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import NavigatorTask from '~scene/world/level/navigator/task';
import { calcGrowth, equalPositions } from '~lib/utils';
import Player from '~scene/world/entities/player';
import Building from '~scene/world/entities/building';
import Level from '~scene/world/level';
import Sprite from '~scene/world/entities/sprite';
import World from '~scene/world';

import { TileType } from '~type/level';
import { WorldEffect } from '~type/world';
import { LiveEvents } from '~type/live';
import { EnemyData, EnemyTexture } from '~type/enemy';

import { ENEMY_PATH_BREAKPOINT, ENEMY_TEXTURE_META } from '~const/enemy';
import {
  ENEMY_DAMAGE_GROWTH, ENEMY_HEALTH_GROWTH, ENEMY_SPEED_GROWTH,
  ENEMY_KILL_EXPERIENCE, ENEMY_KILL_EXPERIENCE_GROWTH,
} from '~const/difficulty';

export default class Enemy extends Sprite {
  /**
   * Damage power.
   */
  private damage: number;

  /**
   * Maximum speed.
   */
  private speed: number;

  /**
   * Pause for pursuit and attacks.
   */
  private calmPause: number = 0;

  /**
   * Player experience multiplier per kill this enemy.
   */
  private experienceMultiply: number;

  /**
   * Current finded path to player.
   */
  private _currentPath: Phaser.Types.Math.Vector2Like[] = [];

  public get currentPath() { return this._currentPath; }

  private set currentPath(v) { this._currentPath = v; }

  /**
   * Current task of path finding.
   */
  private pathFindingTask: NavigatorTask;

  /**
   * Timer for freeze effect.
   */
  private timerTint?: Phaser.Time.TimerEvent;

  /**
   * Enemy constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, texture, health, damage, speed,
    scale = 1.0,
    experienceMultiply = 1.0,
  }: EnemyData) {
    super(scene, {
      texture,
      positionAtMatrix,
      health: calcGrowth(health * scene.difficulty, ENEMY_HEALTH_GROWTH, scene.wave.number),
    });
    scene.add.existing(this);
    scene.enemies.add(this);

    this.damage = calcGrowth(damage * scene.difficulty, ENEMY_DAMAGE_GROWTH, scene.wave.number);
    this.speed = calcGrowth(speed, ENEMY_SPEED_GROWTH, scene.wave.number);
    this.experienceMultiply = experienceMultiply;

    // Configure physics
    const offset = scale * 2;
    this.body.setCircle((this.width / 2) - offset, offset, offset);
    this.setScale(scale);
    this.setPushable(false);

    this.setVisible(this.atVisibleTile());

    // Add spawn effect
    if (this.visible) {
      this.container.setAlpha(0.0);
      this.calm(750);
      this.setScale(0.1);
      this.scene.tweens.add({
        targets: this,
        scale,
        duration: 750,
        onComplete: () => {
          this.container.setAlpha(1.0);
        },
      });
      this.scene.effects.emit(WorldEffect.GLOW, this, {
        x: this.x,
        y: this.y,
        lifespan: { min: 150, max: 250 },
        scale: { start: 0.25, end: 0.0 },
        frequency: 2,
        speed: 100,
        quantity: 2,
        tint: 0x000,
      }, 500);
    }

    // Add animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(texture, {}),
      frameRate: ENEMY_TEXTURE_META[texture].frameRate,
      repeat: -1,
      delay: Math.random() * 500,
    });
    this.play('idle');

    // Add events callbacks
    this.live.on(LiveEvents.DEAD, () => this.onDead());
    this.live.on(LiveEvents.DAMAGE, () => this.onDamage());
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.timerTint) {
        this.timerTint.destroy();
      }
    });
  }

  /**
   * Update visible state and pursuit process.
   */
  public update() {
    super.update();

    this.setVisible(this.atVisibleTile());

    if (!this.isCanPursuit()) {
      this.setVelocity(0, 0);
      return;
    }

    const { player } = this.scene;
    const distanceToTarget = Phaser.Math.Distance.BetweenPoints(player, this);
    if (distanceToTarget < ENEMY_PATH_BREAKPOINT) {
      // Move directly towards player
      this.moveTo(player);
      this.resetPath();
    } else if (this.currentPath.length > 0) {
      // Move by saved path
      this.nextPathTile();
      this.moveToTile();
    }
  }

  /**
   * Pause enemy and add effects.
   *
   * @param duration - Pause duration
   */
  public freeze(duration: number) {
    const finalDuration = duration / this.scale;
    this.calm(finalDuration);

    if (!this.visible) {
      return;
    }

    this.scene.effects.emit(WorldEffect.GLOW, this, {
      follow: this,
      lifespan: { min: 100, max: 150 },
      scale: { start: 0.2, end: 0.1 },
      frequency: 2,
      speed: 80,
    }, 250);

    if (this.timerTint) {
      this.timerTint.elapsed = 0;
    } else {
      this.setTint(0x00a8ff);
      this.timerTint = this.scene.time.delayedCall(finalDuration, () => {
        this.clearTint();
        delete this.timerTint;
      });
    }
  }

  /**
   * Give target damage.
   *
   * @param target - Player or building
   */
  public attack(target: Player | Building) {
    if (this.isCalm() || target.live.isDead()) {
      return;
    }

    target.live.damage(this.damage);

    this.calm(1000);
  }

  /**
   * Find new path and move.
   */
  public updatePath() {
    const { player, level } = this.scene;

    if (this.pathFindingTask) {
      return;
    }

    if (this.currentPath.length > 0) {
      // Check if target position is not changed
      const prev = this.currentPath[this.currentPath.length - 1];
      if (equalPositions(prev, player.positionAtMatrix)) {
        return;
      }
    }

    const onComplete = (path: Phaser.Types.Math.Vector2Like[]) => {
      delete this.pathFindingTask;

      if (!path) {
        this.destroy();
        console.warn('Enemy could not find path and was destroyed');
        return;
      }

      path.shift();
      this.currentPath = path;

      if (this.isCanPursuit()) {
        this.moveToTile();
      }
    };

    this.pathFindingTask = level.navigator.createTask(
      this.positionAtMatrix,
      player.positionAtMatrix,
      onComplete,
    );
  }

  /**
   * Clear finded path.
   */
  private resetPath() {
    this.currentPath = [];

    if (this.pathFindingTask) {
      this.pathFindingTask.cancel();
      delete this.pathFindingTask;
    }
  }

  /**
   * Check is path waypoint has been reached.
   */
  private nextPathTile() {
    const [target] = this.currentPath;
    if (equalPositions(target, this.positionAtMatrix)) {
      this.currentPath.shift();
    }
  }

  /**
   * Move enemy to target tile position.
   */
  private moveToTile() {
    const [target] = this.currentPath;
    if (target) {
      const positionAtWorld = Level.ToWorldPosition(target);
      this.moveTo(positionAtWorld);
    }
  }

  /**
   * Move enemy to world position.
   *
   * @param position - Position at world
   */
  private moveTo(position: Phaser.Types.Math.Vector2Like) {
    const direction = Phaser.Math.Angle.Between(this.x, this.y, position.x, position.y);
    const collide = this.handleCollide(direction);
    if (collide) {
      this.setVelocity(0, 0);
      return;
    }

    const velocity = this.scene.physics.velocityFromRotation(direction, this.speed);
    this.setVelocity(velocity.x, velocity.y);
  }

  /**
   * Get and handle collides.
   */
  private handleCollide(direction: number): boolean {
    const tile = this.getCollide(direction, [TileType.BUILDING], false);

    if (tile instanceof Building) {
      this.attack(tile);
    }

    return Boolean(tile);
  }

  /**
   * Check if enemy can pursuit player.
   */
  private isCanPursuit(): boolean {
    return (
      !this.isCalm()
      && !this.live.isDead()
      && !this.scene.player.live.isDead()
    );
  }

  /**
   * Pause enemy pursuit and attacks.
   *
   * @param duration - Pause duration
   */
  private calm(duration: number) {
    this.calmPause = this.scene.getTimerNow() + duration;
  }

  /**
   * Check if enemy pursuit and attacks is paused.
   */
  private isCalm() {
    return (this.calmPause > this.scene.getTimerNow());
  }

  /**
   * Check if current ground tile is visible.
   */
  private atVisibleTile(): boolean {
    return this.scene.level.getTile({ ...this.positionAtMatrix, z: 0 })?.visible || false;
  }

  /**
   * Enemy dead event.
   */
  private onDead() {
    const { player, wave } = this.scene;
    const defaultExperience = ENEMY_KILL_EXPERIENCE * this.experienceMultiply;
    const experience = calcGrowth(defaultExperience, ENEMY_KILL_EXPERIENCE_GROWTH, wave.number);
    player.giveExperience(experience);
    player.incrementKills();

    this.stop();
    this.scene.tweens.add({
      targets: this,
      alpha: 0.0,
      duration: 250,
      onComplete: () => {
        this.destroy();
      },
    });
  }

  /**
   * Enemy damage event.
   */
  private onDamage() {
    if (!this.visible) {
      return;
    }

    this.scene.effects.emit(WorldEffect.BLOOD, this, {
      follow: this,
      lifespan: { min: 100, max: 250 },
      scale: { start: 1.0, end: 0.5 },
      frequency: 2,
      speed: 100,
      maxParticles: 6,
    }, 250);
  }
}

registerAssets(Object.values(EnemyTexture).map((texture) => ({
  key: texture,
  type: 'spritesheet',
  url: `assets/sprites/${texture}.png`,
  frameConfig: {
    frameWidth: ENEMY_TEXTURE_META[texture].size,
    frameHeight: ENEMY_TEXTURE_META[texture].size,
  },
})));

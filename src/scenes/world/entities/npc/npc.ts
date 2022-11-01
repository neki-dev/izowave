import Phaser from 'phaser';

import { Sprite } from '~entity/sprite';
import { equalPositions } from '~lib/utils';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { NavigatorTask } from '~scene/world/level/navigator/task';
import { NPCData } from '~type/world/entities/npc';

export class NPC extends Sprite {
  /**
   * Current finded path to target.
   */
  private currentPath: Phaser.Types.Math.Vector2Like[] = [];

  /**
   * Current task of path finding.
   */
  private pathFindingTask: Nullable<NavigatorTask> = null;

  /**
   * Distance to target for start find path.
   */
  private pathBreakpoint: number;

  /**
   * Damage power.
   */
  public damage: Nullable<number> = null;

  /**
   * Maximum speed.
   */
  public speed: number;

  /**
   * Pause for pursuit and attacks.
   */
  private stopCalmTimestamp: number = 0;

  /**
   * Finded path is completed.
   */
  public pathComplete: boolean = false;

  /**
   * NPC constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, texture, health, speed, pathBreakpoint,
    damage = null, frameRate = 4,
  }: NPCData) {
    super(scene, { texture, positionAtMatrix, health });
    scene.add.existing(this);

    this.damage = damage;
    this.speed = speed;
    this.pathBreakpoint = pathBreakpoint;

    this.setVisible(this.atVisibleTile());

    // Add animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(texture, {}),
      frameRate,
      repeat: -1,
      delay: Math.random() * 500,
    });
    this.anims.play('idle');
  }

  /**
   * Update visible state and pursuit process.
   */
  public update() {
    super.update();

    this.setVisible(this.atVisibleTile());

    if (!this.isCanPursuit()) {
      this.setVelocity(0, 0);
      this.pathComplete = false;

      return;
    }

    if (this.getDistanceToTarget() > this.pathBreakpoint) {
      this.moveByPath();
      this.pathComplete = false;

      return;
    }

    this.resetPath();
    this.pathComplete = true;
  }

  /**
   * Pause NPC pursuit and attacks.
   *
   * @param duration - Pause duration
   */
  public calm(duration: number) {
    this.stopCalmTimestamp = this.scene.getTimerNow() + duration;
  }

  /**
   * Check if NPC pursuit and attacks is paused.
   */
  public isCalm(): boolean {
    return (this.stopCalmTimestamp > this.scene.getTimerNow());
  }

  /**
   * Find new path and move.
   */
  public updatePath() {
    if (this.pathFindingTask) {
      return;
    }

    if (this.getDistanceToTarget() <= this.pathBreakpoint) {
      return;
    }

    if (this.currentPath.length > 0) {
      // Check if target position is not changed
      const prev = this.currentPath[this.currentPath.length - 1];

      if (equalPositions(prev, this.scene.player.positionAtMatrix)) {
        return;
      }
    }

    const onComplete = (path: Phaser.Types.Math.Vector2Like[]) => {
      this.pathFindingTask = null;

      if (!path) {
        this.destroy();
        console.warn('NPC couldn\'t find path and was destroyed');

        return;
      }

      path.shift();
      this.currentPath = path;

      if (this.isCanPursuit()) {
        this.moveToTile();
      }
    };

    this.pathFindingTask = this.scene.level.navigator.createTask(
      this.positionAtMatrix,
      this.scene.player.positionAtMatrix,
      onComplete,
    );
  }

  /**
   * Get distance to target.
   */
  public getDistanceToTarget(): number {
    return Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
  }

  /**
   * Move NPC to world position.
   *
   * @param position - Position at world
   */
  public moveTo(position: Phaser.Types.Math.Vector2Like) {
    const direction = Phaser.Math.Angle.Between(this.x, this.y, position.x, position.y);
    const velocity = this.scene.physics.velocityFromRotation(direction, this.speed);
    const collide = this.handleCollide(direction);

    if (collide) {
      this.setVelocity(0, 0);
      this.body.setImmovable(true);

      return;
    }

    this.body.setImmovable(false);
    this.setVelocity(velocity.x, velocity.y);
  }

  /**
   * Event dead.
   */
  public onDead() {
    super.onDead();

    if (this.visible) {
      this.anims.stop();
      this.scene.tweens.add({
        targets: this,
        alpha: 0.0,
        duration: 250,
        onComplete: () => {
          this.destroy();
        },
      });
    } else {
      this.destroy();
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
   * Clear finded path.
   */
  private resetPath() {
    this.currentPath = [];

    if (this.pathFindingTask) {
      this.pathFindingTask.cancel();
      this.pathFindingTask = null;
    }
  }

  /**
   * Move NPC by finded path.
   */
  private moveByPath() {
    if (this.currentPath.length > 0) {
      this.nextPathTile();
      this.moveToTile();
    }
  }

  /**
   * Move NPC to target tile position.
   */
  private moveToTile() {
    const [target] = this.currentPath;

    if (target) {
      const positionAtWorld = Level.ToWorldPosition(target);

      this.moveTo(positionAtWorld);
    }
  }

  /**
   * Check if NPC can pursuit target.
   */
  private isCanPursuit(): boolean {
    return (
      !this.isCalm()
      && !this.live.isDead()
      && !this.scene.player.live.isDead()
    );
  }

  /**
   * Check if current ground tile is visible.
   */
  private atVisibleTile(): boolean {
    return this.scene.level.isVisibleTile({
      ...this.positionAtMatrix,
      z: 0,
    });
  }
}

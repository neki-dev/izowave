import Phaser from 'phaser';

import { WORLD_DEPTH_UI } from '~const/world';
import { Sprite } from '~entity/sprite';
import { equalPositions } from '~lib/utils';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { NavigatorTask } from '~scene/world/level/navigator/task';
import { NPCData } from '~type/world/entities/npc';
import { Vector2D } from '~type/world/level';

export class NPC extends Sprite {
  /**
   * Current finded path to target.
   */
  private currentPath: Vector2D[] = [];

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
   * Path debug graphics.
   */
  private pathDebug: Nullable<Phaser.GameObjects.Graphics> = null;

  /**
   * NPC constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, texture, health, speed, pathBreakpoint,
    damage = null, frameRate = 4,
  }: NPCData) {
    super(scene, { texture, positionAtMatrix, health });
    scene.add.existing(this);
    scene.entityGroups.npc.add(this);

    this.damage = damage;
    this.speed = speed;
    this.pathBreakpoint = pathBreakpoint;

    this.setVisible(this.atVisibleTile());
    this.addDebugPath();

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
   * Check is NPC pursuit and attacks is paused.
   */
  public isCalm() {
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

    const onComplete = (path: Vector2D[]) => {
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

      this.drawDebugPath();
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
  public getDistanceToTarget() {
    return Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
  }

  /**
   * Move NPC to world position.
   *
   * @param position - Position at world
   */
  public moveTo(position: Vector2D) {
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
   * Check is NPC can pursuit target.
   */
  private isCanPursuit() {
    return (
      !this.isCalm()
      && !this.live.isDead()
      && !this.scene.player.live.isDead()
    );
  }

  /**
   * Check is current ground tile is visible.
   */
  private atVisibleTile() {
    return this.scene.level.isVisibleTile({
      ...this.positionAtMatrix,
      z: 0,
    });
  }

  /**
   * Add path debugger.
   */
  private addDebugPath() {
    if (!this.scene.physics.world.drawDebug) {
      return;
    }

    this.pathDebug = this.scene.add.graphics();
    this.pathDebug.setDepth(WORLD_DEPTH_UI);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.pathDebug?.destroy();
    });
  }

  /**
   * Draw debug path lines.
   */
  private drawDebugPath() {
    if (!this.pathDebug) {
      return;
    }

    this.pathDebug.clear();
    this.pathDebug.lineStyle(2, 0xe3fc03);
    this.pathDebug.beginPath();

    const points = [
      this.positionAtMatrix,
      ...this.currentPath,
    ];

    for (let i = 1; i < points.length; i++) {
      const prev = Level.ToWorldPosition(points[i - 1]);
      const next = Level.ToWorldPosition(points[i]);

      this.pathDebug.moveTo(prev.x, prev.y);
      this.pathDebug.lineTo(next.x, next.y);
    }

    this.pathDebug.closePath();
    this.pathDebug.strokePath();
  }
}

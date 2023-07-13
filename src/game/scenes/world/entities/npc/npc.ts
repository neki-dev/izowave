import Phaser from 'phaser';

import { DEBUG_MODS } from '~const/game';
import { WORLD_DEPTH_UI } from '~const/world';
import { Sprite } from '~entity/sprite';
import { equalPositions } from '~lib/utils';
import { Level } from '~scene/world/level';
import { NavigatorTask } from '~scene/world/level/navigator/task';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { INPC, NPCData } from '~type/world/entities/npc';
import { Vector2D } from '~type/world/level';

export class NPC extends Sprite implements INPC {
  public isPathPassed: boolean = false;

  private pathToTarget: Vector2D[] = [];

  private pathFindingTask: Nullable<NavigatorTask> = null;

  private pathFindTriggerDistance: number;

  private pathDebug: Nullable<Phaser.GameObjects.Graphics> = null;

  private calmEndTimestamp: number = 0;

  constructor(scene: IWorld, {
    positionAtMatrix, texture, health, speed, pathFindTriggerDistance, frameRate = 4,
  }: NPCData) {
    super(scene, {
      texture, positionAtMatrix, health, speed,
    });
    scene.add.existing(this);
    scene.addEntity(EntityType.NPC, this);

    this.pathFindTriggerDistance = pathFindTriggerDistance;

    this.setVisible(this.atVisibleTile());
    this.addDebugPath();

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(texture, {}),
      frameRate,
      repeat: -1,
      delay: Math.random() * 500,
    });
    this.anims.play('idle');
  }

  public update() {
    super.update();

    this.setVisible(this.atVisibleTile());

    if (!this.isCanPursuit()) {
      this.setVelocity(0, 0);
      this.isPathPassed = false;

      return;
    }

    if (this.getDistanceToTarget() > this.pathFindTriggerDistance) {
      this.moveByPath();
      this.isPathPassed = false;

      return;
    }

    this.resetPath();
    this.isPathPassed = true;
  }

  public calmDown(duration: number) {
    this.calmEndTimestamp = this.scene.getTime() + duration;
  }

  public isCalmed() {
    return (this.calmEndTimestamp > this.scene.getTime());
  }

  public findPathToTarget() {
    if (this.pathFindingTask) {
      return;
    }

    if (this.getDistanceToTarget() <= this.pathFindTriggerDistance) {
      return;
    }

    if (this.pathToTarget.length > 0) {
      const prevPosition = this.pathToTarget[this.pathToTarget.length - 1];

      if (equalPositions(prevPosition, this.scene.player.positionAtMatrix)) {
        return;
      }
    }

    const onComplete = (path: Nullable<Vector2D[]>) => {
      this.pathFindingTask = null;

      if (!path) {
        this.destroy();
        console.warn('NPC couldn\'t find path and was destroyed');

        return;
      }

      path.shift();
      this.pathToTarget = path;

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

  public getDistanceToTarget() {
    return Phaser.Math.Distance.BetweenPoints(
      this.getPositionOnGround(),
      this.scene.player.getPositionOnGround(),
    );
  }

  public moveTo(position: Vector2D) {
    const rotation = Phaser.Math.Angle.BetweenPoints(this.getPositionOnGround(), position);
    const velocity = this.scene.physics.velocityFromRotation(rotation, this.speed);
    const direction = Phaser.Math.RadToDeg(rotation);
    const collide = this.handleCollide(direction);

    if (collide) {
      this.setVelocity(0, 0);
      this.body.setImmovable(true);

      return;
    }

    this.body.setImmovable(false);
    this.setVelocity(velocity.x, velocity.y);
  }

  private nextPathTile() {
    const [firstNode] = this.pathToTarget;

    if (equalPositions(firstNode, this.positionAtMatrix)) {
      this.pathToTarget.shift();
    }
  }

  private resetPath() {
    this.pathToTarget = [];

    if (this.pathFindingTask) {
      this.pathFindingTask.cancel();
      this.pathFindingTask = null;
    }
  }

  private moveByPath() {
    if (this.pathToTarget.length > 0) {
      this.nextPathTile();
      this.moveToTile();
    }
  }

  private moveToTile() {
    const [target] = this.pathToTarget;

    if (target) {
      const positionAtWorld = Level.ToWorldPosition({ ...target, z: 0 });

      this.moveTo(positionAtWorld);
    }
  }

  private isCanPursuit() {
    return (
      !this.isCalmed()
      && !this.live.isDead()
      && !this.scene.player.live.isDead()
    );
  }

  private atVisibleTile() {
    return this.scene.level.isVisibleTile({
      ...this.positionAtMatrix,
      z: 0,
    });
  }

  private addDebugPath() {
    if (!DEBUG_MODS.path) {
      return;
    }

    this.pathDebug = this.scene.add.graphics();
    this.pathDebug.setDepth(WORLD_DEPTH_UI);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.pathDebug?.destroy();
    });
  }

  private drawDebugPath() {
    if (!this.pathDebug) {
      return;
    }

    this.pathDebug.clear();
    this.pathDebug.lineStyle(2, 0xe3fc03);
    this.pathDebug.beginPath();

    const points = [
      this.positionAtMatrix,
      ...this.pathToTarget,
    ];

    for (let i = 1; i < points.length; i++) {
      const prev = Level.ToWorldPosition({ ...points[i - 1], z: 0 });
      const next = Level.ToWorldPosition({ ...points[i], z: 0 });

      this.pathDebug.moveTo(prev.x, prev.y);
      this.pathDebug.lineTo(next.x, next.y);
    }

    this.pathDebug.closePath();
    this.pathDebug.strokePath();
  }
}

import Phaser from 'phaser';

import { DEBUG_MODS } from '~const/game';
import { WORLD_DEPTH_GRAPHIC } from '~const/world';
import { NPC_PATH_FIND_RATE } from '~const/world/entities/npc';
import { LEVEL_MAP_PERSPECTIVE } from '~const/world/level';
import { Sprite } from '~entity/sprite';
import { isPositionsEqual, getIsometricAngle, getIsometricDistance } from '~lib/dimension';
import { Level } from '~scene/world/level';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { INPC, NPCData } from '~type/world/entities/npc';
import { PositionAtWorld } from '~type/world/level';

export class NPC extends Sprite implements INPC {
  public isPathPassed: boolean = false;

  private pathToTarget: PositionAtWorld[] = [];

  private pathFindingTask: Nullable<string> = null;

  private pathFindTriggerDistance: number = 0;

  private pathFindTimestamp: number = 0;

  private pathDebug: Nullable<Phaser.GameObjects.Graphics> = null;

  private freezeTimestamp: number = 0;

  private freezeEffectTimer: Nullable<Phaser.Time.TimerEvent> = null;

  private seesInvisibleTarget: boolean = false;

  constructor(scene: IWorld, {
    pathFindTriggerDistance, seesInvisibleTarget, texture, customAnimation, ...data
  }: NPCData) {
    super(scene, { ...data, texture });
    scene.addEntityToGroup(this, EntityType.NPC);

    this.pathFindTriggerDistance = pathFindTriggerDistance;
    this.seesInvisibleTarget = seesInvisibleTarget;

    this.addDebugPath();

    if (!customAnimation) {
      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers(texture, {}),
        frameRate: 4,
        repeat: -1,
        delay: Math.random() * 500,
      });
      this.anims.play('idle');
    }

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.freezeEffectTimer) {
        this.freezeEffectTimer.destroy();
      }
      if (this.pathFindingTask) {
        this.scene.level.navigator.cancelTask(this.pathFindingTask);
      }
    });
  }

  public update() {
    super.update();

    if (this.isCanPursuit()) {
      if (this.getDistanceToTarget() <= this.pathFindTriggerDistance) {
        this.resetPath();
        this.isPathPassed = true;
      } else {
        this.findPathToTarget();
        this.moveByPath();
        this.isPathPassed = false;
      }
    } else {
      this.setVelocity(0, 0);
      this.isPathPassed = false;
    }
  }

  public freeze(duration: number, effects: boolean = false) {
    this.freezeTimestamp = this.scene.getTime() + duration;

    if (effects) {
      this.scene.fx.createFrozeEffect(this);

      if (this.freezeEffectTimer) {
        this.freezeEffectTimer.elapsed = 0;
      } else {
        this.setTint(0x00f2ff);
        this.freezeEffectTimer = this.scene.time.delayedCall(duration, () => {
          this.clearTint();
          this.freezeEffectTimer = null;
        });
      }
    }
  }

  public isFreezed(withEffects?: boolean) {
    return (
      (this.freezeTimestamp > this.scene.getTime())
      && (!withEffects || Boolean(this.freezeEffectTimer))
    );
  }

  private findPathToTarget() {
    if (this.pathFindingTask) {
      return;
    }

    const now = Date.now();

    if (this.pathFindTimestamp > now) {
      return;
    }

    const targetPosition = this.seesInvisibleTarget
      ? this.scene.player.positionAtMatrix
      : this.scene.player.lastVisiblePosition;

    if (this.pathToTarget.length > 0) {
      const prevPosition = this.pathToTarget[this.pathToTarget.length - 1];

      if (isPositionsEqual(prevPosition, targetPosition)) {
        return;
      }
    }

    const from = this.positionAtMatrix;

    this.pathFindTimestamp = now + NPC_PATH_FIND_RATE;
    this.pathFindingTask = this.scene.level.navigator.createTask({
      from,
      to: targetPosition,
      grid: this.scene.level.gridCollide,
    }, (path: Nullable<PositionAtWorld[]>) => {
      if (!this.active) {
        return;
      }

      if (path) {
        path.shift();
        this.pathToTarget = path;
        this.pathFindingTask = null;

        if (this.isCanPursuit()) {
          this.moveToTile();
        }

        this.drawDebugPath();
      } else {
        this.pathFindingTask = null;
      }
    });
  }

  private getDistanceToTarget() {
    return getIsometricDistance(
      this.getBottomFace(),
      this.scene.player.getBottomFace(),
    );
  }

  public moveTo(position: PositionAtWorld) {
    const rotation = getIsometricAngle(this.getBottomFace(), position);
    const direction = Phaser.Math.RadToDeg(rotation);
    const collide = this.handleCollide(direction);

    if (collide) {
      this.setVelocity(0, 0);
    } else {
      const speed = this.isFreezed() ? (this.speed * 0.2) : this.speed;
      const velocity = this.scene.physics.velocityFromRotation(rotation, speed);

      this.flipX = (velocity.x > 0);
      this.setVelocity(
        velocity.x,
        velocity.y * LEVEL_MAP_PERSPECTIVE,
      );
    }
  }

  private nextPathTile() {
    const tilePosition = Level.ToWorldPosition(this.pathToTarget[0]);
    const currentPosition = this.getBottomFace();
    const signX = Math.sign(this.body.velocity.x);
    const signY = Math.sign(this.body.velocity.y);

    if (
      currentPosition.x * signX >= tilePosition.x * signX
      && currentPosition.y * signY >= tilePosition.y * signY
    ) {
      this.pathToTarget.shift();
    }
  }

  private resetPath() {
    this.pathToTarget = [];

    if (this.pathFindingTask) {
      this.scene.level.navigator.cancelTask(this.pathFindingTask);
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
    const target = this.pathToTarget[0];

    if (target) {
      const positionAtWorld = Level.ToWorldPosition(target);

      this.moveTo(positionAtWorld);
    }
  }

  private isCanPursuit() {
    return (
      !this.live.isDead()
      && !this.scene.player.live.isDead()
    );
  }

  private addDebugPath() {
    if (!DEBUG_MODS.path) {
      return;
    }

    this.pathDebug = this.scene.add.graphics();
    this.pathDebug.setDepth(WORLD_DEPTH_GRAPHIC);

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
      const prev = Level.ToWorldPosition({ ...points[i - 1] });
      const next = Level.ToWorldPosition({ ...points[i] });

      this.pathDebug.moveTo(prev.x, prev.y);
      this.pathDebug.lineTo(next.x, next.y);
    }

    this.pathDebug.closePath();
    this.pathDebug.strokePath();
  }
}

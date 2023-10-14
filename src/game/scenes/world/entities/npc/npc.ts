import Phaser from 'phaser';

import { DEBUG_MODS } from '~const/game';
import { WORLD_DEPTH_GRAPHIC } from '~const/world';
import { NPC_PATH_FIND_RATE } from '~const/world/entities/npc';
import { LEVEL_TILE_SIZE } from '~const/world/level';
import { Sprite } from '~entity/sprite';
import { equalPositions, getIsometricAngle, getIsometricDistance } from '~lib/utils';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import { INPC, NPCData, NPCEvent } from '~type/world/entities/npc';
import { Vector2D } from '~type/world/level';

export class NPC extends Sprite implements INPC {
  public isPathPassed: boolean = false;

  private pathToTarget: Vector2D[] = [];

  private pathFindingTask: Nullable<string> = null;

  private pathFindTriggerDistance: number = 0;

  private pathFindTimestamp: number = 0;

  private pathDebug: Nullable<Phaser.GameObjects.Graphics> = null;

  private freezeTimestamp: number = 0;

  private freezeEffectTimer: Nullable<Phaser.Time.TimerEvent> = null;

  constructor(scene: IWorld, {
    pathFindTriggerDistance, texture, ...data
  }: NPCData) {
    super(scene, { ...data, texture });
    scene.addEntityToGroup(this, EntityType.NPC);

    this.setVisible(false);
    this.pathFindTriggerDistance = pathFindTriggerDistance;

    this.addDebugPath();

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(texture, {}),
      frameRate: 4,
      repeat: -1,
      delay: Math.random() * 500,
    });
    this.anims.play('idle');

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

  public freeze(duration: number, effects = false) {
    this.freezeTimestamp = this.scene.getTime() + duration;

    if (!effects) {
      return;
    }

    if (this.freezeEffectTimer) {
      this.freezeEffectTimer.elapsed = 0;
    } else {
      this.setTint(0x00a8ff);
      this.freezeEffectTimer = this.scene.time.delayedCall(duration, () => {
        this.clearTint();
        this.freezeEffectTimer = null;
      });
    }

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Particles(this, {
        key: 'freeze',
        texture: ParticlesTexture.GLOW,
        params: {
          duration: 200,
          follow: this,
          followOffset: this.getBodyOffset(),
          lifespan: { min: 100, max: 150 },
          scale: 0.2,
          speed: 80,
          tint: 0x00ddff,
        },
      });
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

    if (this.pathToTarget.length > 0) {
      const prevPosition = this.pathToTarget[this.pathToTarget.length - 1];

      if (equalPositions(prevPosition, this.scene.player.positionAtMatrix)) {
        return;
      }
    }

    const from = this.positionAtMatrix;

    this.pathFindTimestamp = now + NPC_PATH_FIND_RATE;
    this.pathFindingTask = this.scene.level.navigator.createTask({
      from,
      to: this.scene.player.positionAtMatrix,
      grid: this.scene.level.gridCollide,
      compress: true,
    }, (path: Nullable<Vector2D[]>) => {
      if (!this.active) {
        return;
      }

      if (path) {
        if (!this.visible) {
          this.activate();
        }

        path.shift();
        this.pathToTarget = path;
        this.pathFindingTask = null;

        if (this.isCanPursuit()) {
          this.moveToTile();
        }

        this.drawDebugPath();
      } else {
        this.pathFindingTask = null;
        this.emit(NPCEvent.PATH_NOT_FOUND, from);
      }
    });
  }

  public activate() {
    this.setVisible(true);
  }

  public getDistanceToTarget() {
    return getIsometricDistance(
      this.getPositionOnGround(),
      this.scene.player.getPositionOnGround(),
    );
  }

  public moveTo(position: Vector2D) {
    const rotation = getIsometricAngle(this.getPositionOnGround(), position);
    const direction = Phaser.Math.RadToDeg(rotation);
    const collide = this.handleCollide(direction);

    if (collide) {
      this.setVelocity(0, 0);
    } else {
      const speed = this.isFreezed() ? (this.speed * 0.1) : this.speed;
      const velocity = this.scene.physics.velocityFromRotation(rotation, speed);

      this.flipX = (velocity.x > 0);
      this.setVelocity(
        velocity.x,
        velocity.y * LEVEL_TILE_SIZE.persperctive,
      );
    }
  }

  private nextPathTile() {
    const firstNode = this.pathToTarget[0];
    const tilePosition = Level.ToWorldPosition({ ...firstNode, z: 0 });
    const currentPosition = this.getPositionOnGround();
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
      const positionAtWorld = Level.ToWorldPosition({ ...target, z: 0 });

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
      const prev = Level.ToWorldPosition({ ...points[i - 1], z: 0 });
      const next = Level.ToWorldPosition({ ...points[i], z: 0 });

      this.pathDebug.moveTo(prev.x, prev.y);
      this.pathDebug.lineTo(next.x, next.y);
    }

    this.pathDebug.closePath();
    this.pathDebug.strokePath();
  }
}

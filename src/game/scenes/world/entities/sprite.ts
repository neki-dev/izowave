import Phaser from 'phaser';

import { DEBUG_MODS } from '~const/game';
import { WORLD_COLLIDE_SPEED_FACTOR, WORLD_DEPTH_GRAPHIC } from '~const/world';
import { Live } from '~lib/live';
import { equalPositions } from '~lib/utils';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { GameFlag, GameSettings } from '~type/game';
import { ILive, LiveEvents } from '~type/live';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import {
  ISprite, SpriteData, SpriteIndicator, SpriteIndicatorData,
} from '~type/world/entities/sprite';
import { LevelBiome, TileType, Vector2D } from '~type/world/level';

export class Sprite extends Phaser.Physics.Arcade.Sprite implements ISprite {
  readonly scene: IWorld;

  readonly body: Phaser.Physics.Arcade.Body;

  readonly live: ILive;

  readonly container: Phaser.GameObjects.Container;

  public gamut: number = 0;

  public speed: number = 0;

  public currentBiome: Nullable<LevelBiome> = null;

  private _positionAtMatrix: Vector2D;

  public get positionAtMatrix() { return this._positionAtMatrix; }

  private set positionAtMatrix(v) { this._positionAtMatrix = v; }

  private collisionTargets: TileType[] = [];

  private collisionHandler: Nullable<(tile: Phaser.GameObjects.Image) => void> = null;

  private collisionGround: boolean = false;

  private indicators: SpriteIndicator[] = [];

  private positionDebug: Nullable<Phaser.GameObjects.Graphics> = null;

  constructor(scene: IWorld, {
    texture, positionAtMatrix, health, speed, frame = 0,
  }: SpriteData) {
    const positionAtWorld = Level.ToWorldPosition({
      ...positionAtMatrix,
      z: 0,
    });

    super(scene, positionAtWorld.x, positionAtWorld.y, texture, frame);
    scene.add.existing(this);

    this.positionAtMatrix = positionAtMatrix;
    this.live = new Live({ health: health ?? 1 });
    this.container = this.scene.add.container(this.x, this.y);
    this.speed = speed;

    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.setOrigin(0.5, 1.0);
    this.setImmovable(true);
    this.setPushable(false);

    this.addDebugPosition();

    this.live.on(LiveEvents.DAMAGE, this.onDamage.bind(this));
    this.live.on(LiveEvents.DEAD, this.onDead.bind(this));

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.container.destroy();
      this.live.removeAllListeners();
    });
  }

  public update() {
    super.update();

    const positionOnGround = this.getPositionOnGround();
    const depth = Level.GetDepth(positionOnGround.y, 1);

    this.positionAtMatrix = Level.ToMatrixPosition(positionOnGround);
    this.currentBiome = this.scene.level.map.getAt(this.positionAtMatrix);

    this.setDepth(depth);

    this.container.setDepth(depth + 19);
    this.container.setPosition(this.body.center.x, this.body.center.y);
    this.container.setAlpha(this.alpha);
    this.container.setVisible(this.visible);

    this.updateIndicators();

    this.drawDebugGroundPosition();
  }

  public isStopped() {
    return equalPositions(this.body.velocity, { x: 0, y: 0 });
  }

  public getAllPositionsAtMatrix() {
    return this.getProjectionOnGround().map((point) => Level.ToMatrixPosition(point));
  }

  public addCollider(target: EntityType, mode: 'overlap' | 'collider', callback: (sprite: any) => void) {
    this.scene.physics.add[mode](
      this,
      this.scene.getEntitiesGroup(target),
      (_, sprite) => {
        callback(sprite);
      },
    );
  }

  public setTilesCollision(
    targets: TileType[],
    handler: (tile: Phaser.GameObjects.Image) => void,
  ) {
    this.collisionTargets = targets;
    this.collisionHandler = handler;
  }

  public setTilesGroundCollision(state: boolean) {
    this.collisionGround = state;
  }

  public handleCollide(direction: number) {
    const tile = this.getCollidedTile(direction);

    if (this.collisionHandler && tile instanceof Phaser.GameObjects.Image) {
      this.collisionHandler(tile);
    }

    return Boolean(tile);
  }

  private getCollidedTile(direction: number) {
    if (this.collisionTargets.length === 0 && !this.collisionGround) {
      return false;
    }

    const friction = (this.collisionGround && this.currentBiome?.friction) || 1;
    const speedPerFrame = (this.speed / friction) * (WORLD_COLLIDE_SPEED_FACTOR * this.scene.deltaTime);
    const offset = this.scene.physics.velocityFromAngle(direction, speedPerFrame);

    // Check ground collision
    if (this.collisionGround) {
      const currentPositionAtWorld = this.getPositionOnGround();
      const positionAtMatrix = Level.ToMatrixPosition({
        x: currentPositionAtWorld.x + offset.x,
        y: currentPositionAtWorld.y + offset.y,
      });
      const biome = this.scene.level.map.getAt(positionAtMatrix);

      if (!biome?.solid) {
        return true;
      }
    }

    // Check wall collision
    if (this.collisionTargets.length > 0) {
      const positions = this.getProjectionOnGround();

      for (const position of positions) {
        const positionAtMatrix = Level.ToMatrixPosition({
          x: position.x + offset.x,
          y: position.y + offset.y,
        });
        const tile = this.scene.level.getTileWithType({ ...positionAtMatrix, z: 1 }, this.collisionTargets);

        if (tile) {
          return tile;
        }
      }
    }

    return false;
  }

  public getPositionOnGround(): Vector2D {
    return {
      x: this.x,
      y: this.y - this.getGamutOffset(),
    };
  }

  public getBodyOffset(): Vector2D {
    return {
      x: 0,
      y: this.body ? (this.body.center.y - this.y) : 0,
    };
  }

  private getGamutOffset(): number {
    return this.gamut * this.scaleY * 0.5;
  }

  private getProjectionOnGround() {
    const count = 8;
    const rX = this.displayWidth * 0.4;
    const rY = this.getGamutOffset();
    const l = Phaser.Math.PI2 / count;
    const position = this.getPositionOnGround();
    const points: Vector2D[] = [];

    for (let u = 0; u < count; u++) {
      points.push({
        x: position.x + Math.sin(u * l) * rX,
        y: position.y - Math.cos(u * l) * rY,
      });
    }

    return points;
  }

  public addIndicator(data: SpriteIndicatorData) {
    const width = data.size ?? this.displayWidth;
    const body = this.scene.add.rectangle(0, 0, width, 5, 0x000000);

    body.setOrigin(0.0, 0.0);

    const bar = this.scene.add.rectangle(1, 1, 0, 0, data.color);

    bar.setOrigin(0.0, 0.0);

    const container = this.scene.add.container(
      -width / 2,
      -this.body.halfHeight - 10 - (this.indicators.length * 6),
    );

    container.setSize(body.width, body.height);
    container.add([body, bar]);

    this.container.add(container);
    this.indicators.push({ container, value: data.value });
  }

  private updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      const value = indicator.value();

      if (value <= 0.0) {
        indicator.container.destroy();
        this.indicators.splice(index, 1);
      } else {
        const bar = <Phaser.GameObjects.Rectangle> indicator.container.getAt(1);

        bar.setSize((indicator.container.width - 2) * value, indicator.container.height - 2);
      }
    });
  }

  private addDebugPosition() {
    if (!DEBUG_MODS.position) {
      return;
    }

    this.positionDebug = this.scene.add.graphics();
    this.positionDebug.setDepth(WORLD_DEPTH_GRAPHIC);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.positionDebug?.destroy();
    });
  }

  private drawDebugGroundPosition() {
    if (!this.positionDebug) {
      return;
    }

    this.positionDebug.clear();

    // Position
    this.positionDebug.lineStyle(1, 0xff0000);
    this.positionDebug.beginPath();

    const position = this.getPositionOnGround();

    this.positionDebug.moveTo(position.x, position.y);
    this.positionDebug.lineTo(position.x + 10, position.y);
    this.positionDebug.moveTo(position.x, position.y);
    this.positionDebug.lineTo(position.x, position.y + 10);

    this.positionDebug.closePath();
    this.positionDebug.strokePath();

    // Projection
    this.positionDebug.lineStyle(1, 0xffffff);
    this.positionDebug.beginPath();

    const positions = this.getProjectionOnGround();

    const points = [
      ...positions,
      positions[0],
    ];

    for (let i = 1; i < points.length; i++) {
      this.positionDebug.moveTo(points[i - 1].x, points[i - 1].y);
      this.positionDebug.lineTo(points[i].x, points[i].y);
    }

    this.positionDebug.closePath();
    this.positionDebug.strokePath();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onDamage(amount: number) {
    if (
      !this.scene.game.isSettingEnabled(GameSettings.EFFECTS)
      || this.scene.game.isFlagEnabled(GameFlag.NO_BLOOD)
    ) {
      return;
    }

    new Particles(this, {
      key: 'blood',
      texture: ParticlesTexture.BIT_SOFT,
      params: {
        duration: 200,
        follow: this,
        followOffset: this.getBodyOffset(),
        lifespan: { min: 100, max: 250 },
        scale: { start: 1.0, end: 0.5 },
        speed: 60,
        maxAliveParticles: 6,
        tint: 0xdd1e1e,
      },
    });
  }

  public onDead() {
    this.anims.stop();
    this.scene.tweens.add({
      targets: [this, this.container],
      alpha: 0.0,
      duration: 250,
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

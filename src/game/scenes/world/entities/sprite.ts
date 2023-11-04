import Phaser from 'phaser';

import { DEBUG_MODS } from '~const/game';
import { WORLD_COLLIDE_SPEED_FACTOR, WORLD_DEPTH_GRAPHIC } from '~const/world';
import { Indicator } from '~entity/addons/indicator';
import { Live } from '~entity/addons/live';
import { isPositionsEqual } from '~lib/dimension';
import { Level } from '~scene/world/level';
import { ILive, LiveEvents } from '~type/live';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import { IIndicator } from '~type/world/entities/indicator';
import {
  ISprite, SpriteBodyData, SpriteData, SpriteIndicatorData,
} from '~type/world/entities/sprite';
import {
  LevelBiome, TileType, PositionAtWorld, PositionAtMatrix,
} from '~type/world/level';

export class Sprite extends Phaser.Physics.Arcade.Sprite implements ISprite {
  readonly scene: IWorld;

  readonly body: Phaser.Physics.Arcade.Body;

  readonly live: ILive;

  private _container: Phaser.GameObjects.Container;

  public get container() { return this._container; }

  private set container(v) { this._container = v; }

  public gamut: number = 0;

  public speed: number = 0;

  public currentBiome: Nullable<LevelBiome> = null;

  private _positionAtMatrix: PositionAtMatrix;

  public get positionAtMatrix() { return this._positionAtMatrix; }

  private set positionAtMatrix(v) { this._positionAtMatrix = v; }

  private collisionTargets: TileType[] = [];

  private collisionHandler: Nullable<(tile: Phaser.GameObjects.Image) => void> = null;

  private collisionGround: boolean = false;

  private indicators: Phaser.GameObjects.Container;

  private positionDebug: Nullable<Phaser.GameObjects.Graphics> = null;

  constructor(scene: IWorld, {
    texture, positionAtWorld, positionAtMatrix, health, speed, body, frame = 0,
  }: SpriteData) {
    let position: Nullable<{
      matrix: PositionAtMatrix
      world: PositionAtWorld
    }> = null;

    if (positionAtWorld) {
      position = {
        world: positionAtWorld,
        matrix: Level.ToMatrixPosition(positionAtWorld),
      };
    } else if (positionAtMatrix) {
      position = {
        world: Level.ToWorldPosition(positionAtMatrix),
        matrix: positionAtMatrix,
      };
    } else {
      throw Error('Invalid sprite position');
    }

    super(scene, position.world.x, position.world.y, texture, frame);
    scene.add.existing(this);
    scene.addEntityToGroup(this, EntityType.SPRITE);

    this.positionAtMatrix = position.matrix;
    this.live = new Live({ health: health ?? 1 });
    this.speed = speed;

    this.configureBody(body);
    this.addContainer();
    this.addIndicatorsContainer();
    this.addDebugPosition();

    this.live.on(LiveEvents.DAMAGE, this.onDamage.bind(this));
    this.live.on(LiveEvents.DEAD, this.onDead.bind(this));
    this.live.on(LiveEvents.HEAL, this.onHeal.bind(this));

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.container.destroy();
      this.live.removeAllListeners();
    });
  }

  public update() {
    const positionOnGround = this.getBottomFace();

    this.positionAtMatrix = Level.ToMatrixPosition(positionOnGround);
    this.currentBiome = this.scene.level.map.getAt(this.positionAtMatrix);

    this.setDepth(positionOnGround.y);

    this.updateContainer();
    this.updateIndicators();

    this.drawDebugGroundPosition();
  }

  private addContainer() {
    this.container = this.scene.add.container();
    this.updateContainer();
  }

  private updateContainer() {
    this.container.setPosition(this.body.center.x, this.body.center.y);
    this.container.setDepth(this.depth);
    this.container.setAlpha(this.alpha);
    this.container.setVisible(this.visible);
  }

  private configureBody(body: SpriteBodyData) {
    this.scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.gamut = body.gamut;
    if (body.type === 'rect') {
      this.body.setSize(body.width, body.height);
    } else if (body.type === 'circle') {
      this.body.setCircle(body.width / 2);
    }

    this.setOrigin(0.5, 1.0);
    this.setImmovable(true);
    this.setPushable(false);
  }

  public isStopped() {
    return isPositionsEqual(this.body.velocity, { x: 0, y: 0 });
  }

  public getAllPositionsAtMatrix() {
    return this.getProjectionOnGround().map((position) => Level.ToMatrixPosition(position));
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
      const currentPositionAtWorld = this.getBottomFace();
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

  public getBottomFace(): PositionAtWorld {
    return {
      x: this.x,
      y: this.y - this.getGamutOffset(),
    };
  }

  public getBodyOffset(): PositionAtWorld {
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
    const position = this.getBottomFace();
    const points: PositionAtWorld[] = [];

    for (let u = 0; u < count; u++) {
      points.push({
        x: position.x + Math.sin(u * l) * rX,
        y: position.y - Math.cos(u * l) * rY,
      });
    }

    return points;
  }

  private addIndicatorsContainer() {
    this.indicators = this.scene.add.container();
    this.indicators.setPosition(
      -this.displayWidth / 2,
      -this.body.halfHeight - 10,
    );

    this.container.add(this.indicators);
  }

  public addIndicator(key: string, data: SpriteIndicatorData) {
    const indicator = new Indicator(this, {
      ...data,
      size: this.displayWidth,
    });

    indicator.setPosition(0, this.indicators.length * -5);
    indicator.setName(key);

    this.indicators.add(indicator);
  }

  public getIndicator(key: string) {
    return this.indicators.getByName<IIndicator>(key) ?? null;
  }

  private updateIndicators() {
    this.indicators.each((indicator: IIndicator) => {
      indicator.updateValue();
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

    const position = this.getBottomFace();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  public onDamage(amount: number) {
    //
  }

  public onHeal() {
    this.scene.fx.createHealEffect(this);
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

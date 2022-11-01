import Phaser from 'phaser';

import { WORLD_COLLIDE_LOOK } from '~const/world';
import { equalPositions } from '~lib/utils';
import { World } from '~scene/world';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { Live } from '~scene/world/live';
import { ParticlesType } from '~type/world/effects';
import { LiveEvents } from '~type/world/entities/live';
import { SpriteData } from '~type/world/entities/sprite';
import { BiomeType, TileType } from '~type/world/level';

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  readonly scene: World;

  readonly body: Phaser.Physics.Arcade.Body;

  /**
   * Health managment.
   */
  readonly live: Live;

  /**
   * Child container.
   */
  private _container: Phaser.GameObjects.Container;

  public get container() { return this._container; }

  private set container(v) { this._container = v; }

  /**
   * Position at matrix.
   */
  private _positionAtMatrix: Phaser.Types.Math.Vector2Like;

  public get positionAtMatrix() { return this._positionAtMatrix; }

  private set positionAtMatrix(v) { this._positionAtMatrix = v; }

  /**
   * Collision tiles.
   */
  private collisionTargets: TileType[] = [];

  /**
   * Collision tile handler.
   */
  private collisionHandler: Nullable<(tile: Phaser.GameObjects.Image) => void> = null;

  /**
   * Flag for handle ground collision.
   */
  private collisionGround: boolean = false;

  /**
   * Health bar above sprite.
   */
  private healthIndicator: Phaser.GameObjects.Container;

  /**
   * Sprite constructor.
   */
  constructor(scene: World, {
    texture, positionAtMatrix, health, frame = 0,
  }: SpriteData) {
    const positionAtWorld = Level.ToWorldPosition({
      ...positionAtMatrix,
      z: 0,
    });

    super(scene, positionAtWorld.x, positionAtWorld.y, texture, frame);
    scene.add.existing(this);

    this.positionAtMatrix = positionAtMatrix;
    this.live = new Live(health);

    // Configure physics

    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.setPushable(false);

    this.addContainer();
    this.addHealthIndicator();

    // Add events callbacks

    this.live.on(LiveEvents.DAMAGE, () => {
      this.onDamage();
    });
    this.live.on(LiveEvents.DEAD, () => {
      this.onDead();
    });
  }

  /**
   * Event update.
   */
  public update() {
    super.update();

    this.positionAtMatrix = Level.ToMatrixPosition(this);

    this.container.setVisible(this.visible);
    if (this.visible) {
      const position = this.getTopCenter();

      this.container.setPosition(position.x, position.y);
      const depth = Level.GetDepth(this.y, 1, this.displayHeight);

      this.setDepth(depth);
      this.container.setDepth(depth);

      this.updateHealthIndicator();
    }
  }

  /**
   * Check if body is stopped.
   */
  public isStopped(): boolean {
    return equalPositions(this.body.velocity, { x: 0, y: 0 });
  }

  /**
   * Get all occupied by body positions.
   */
  public getAllPositionsAtMatrix(): Phaser.Types.Math.Vector2Like[] {
    return this.getCorners().map((point) => Level.ToMatrixPosition(point));
  }

  /**
   * Event damage.
   */
  public onDamage() {
    if (!this.visible) {
      return;
    }

    new Particles(this, {
      type: ParticlesType.BIT,
      duration: 250,
      params: {
        follow: this,
        lifespan: { min: 100, max: 250 },
        scale: { start: 1.0, end: 0.5 },
        speed: 100,
        maxParticles: 6,
        tint: 0xdd1e1e,
      },
    });
  }

  /**
   * Event dead.
   */
  // eslint-disable-next-line class-methods-use-this
  public onDead() {
  }

  /**
   *
   */
  public setTilesCollision(
    targets: TileType[],
    handler: (tile: Phaser.GameObjects.Image) => void,
  ) {
    this.collisionTargets = targets;
    this.collisionHandler = handler;
  }

  /**
   *
   */
  public setTilesGroundCollision(state: boolean) {
    this.collisionGround = state;
  }

  /**
   * Get and handle collided tile.
   */
  public handleCollide(direction: number): boolean {
    const tile = this.getCollidedTile(direction);

    if (this.collisionHandler && tile instanceof Phaser.GameObjects.Image) {
      this.collisionHandler(tile);
    }

    return Boolean(tile);
  }

  /**
   * Get collided tile by direction.
   *
   * @param direction - Current direction in degrees
   */
  private getCollidedTile(
    direction: number,
  ): boolean | Phaser.GameObjects.Image {
    if (this.collisionTargets.length === 0 && !this.collisionGround) {
      return false;
    }

    const target = this.scene.physics.velocityFromAngle(direction, WORLD_COLLIDE_LOOK);
    const occupiedTiles = this.getCorners().map((point) => Level.ToMatrixPosition({
      x: point.x + target.x,
      y: point.y + target.y,
    }));

    for (const positionAtMatrix of occupiedTiles) {
      // If collide tile
      const tile = this.scene.level.getTileWithType({
        ...positionAtMatrix,
        z: 1,
      }, this.collisionTargets);

      if (tile) {
        return tile;
      }

      // If not collide ground tile
      if (this.collisionGround) {
        const tileGround = this.scene.level.getTile({
          ...positionAtMatrix,
          z: 0,
        });

        if (!tileGround || tileGround?.biome.type === BiomeType.WATER) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get body corners.
   */
  private getCorners(): Phaser.Types.Math.Vector2Like[] {
    const count = 8;
    const r = this.body.width / 2;
    const l = Phaser.Math.PI2 / count;

    const points: Phaser.Types.Math.Vector2Like[] = [];

    for (let u = 0; u < count; u++) {
      points.push({
        x: (this.body.position.x + r) + Math.sin(u * l) * r,
        y: (this.body.position.y + r) - Math.cos(u * l) * r,
      });
    }

    return points;
  }

  /**
   * Add attached container.
   */
  private addContainer() {
    this.container = this.scene.add.container(this.x, this.y);

    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.container.destroy();
    });
  }

  /**
   * Add current health indicator above sprite.
   */
  private addHealthIndicator() {
    const width = this.displayWidth * 1.5;
    const body = this.scene.add.rectangle(0, 0, width, 6, 0x000000);

    body.setOrigin(0.0, 0.0);

    const bar = this.scene.add.rectangle(1, 1, 0, 0, 0xe4372c);

    bar.setOrigin(0.0, 0.0);

    this.healthIndicator = this.scene.add.container(-width / 2, -13);
    this.healthIndicator.setSize(body.width, body.height);
    this.healthIndicator.add([body, bar]);

    this.container.add(this.healthIndicator);
  }

  /**
   * Update health indicator progress.
   */
  private updateHealthIndicator() {
    const value = this.live.health / this.live.maxHealth;
    const bar = <Phaser.GameObjects.Rectangle> this.healthIndicator.getAt(1);

    bar.setSize((this.healthIndicator.width - 2) * value, this.healthIndicator.height - 2);
  }
}

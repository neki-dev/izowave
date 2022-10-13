import Phaser from 'phaser';

import { WORLD_COLLIDE_LOOK } from '~const/world';
import { equalPositions } from '~lib/utils';
import { World } from '~scene/world';
import { Live } from '~scene/world/entities/live';
import { Level } from '~scene/world/level';
import { SpriteData } from '~type/sprite';
import { BiomeType, TileType } from '~type/world/level';

export class Sprite extends Phaser.Physics.Arcade.Sprite {
  // @ts-ignore
  readonly scene: World;

  // @ts-ignore
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
    *
    */
  private healthIndicator: Phaser.GameObjects.Container;

  /**
   * Sprite constructor.
   */
  constructor(scene: World, {
    texture, positionAtMatrix, health, frame = 0,
  }: SpriteData) {
    const positionAtWorld = Level.ToWorldPosition({ ...positionAtMatrix, z: 0 });
    super(scene, positionAtWorld.x, positionAtWorld.y, texture, frame);
    scene.add.existing(this);

    this.positionAtMatrix = positionAtMatrix;
    this.live = new Live(health);

    // Configure physics
    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

    this.container = scene.add.container(this.x, this.y);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      this.container.destroy();
    });

    this.addHealthIndicator();
  }

  /**
   * Update event.
   */
  public update() {
    super.update();

    this.positionAtMatrix = Level.ToMatrixPosition(this);

    this.container.setVisible(this.visible);
    if (this.visible) {
      const { x, y } = this.getTopCenter();
      this.container.setPosition(x, y);
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
   * Get collided tile by direction.
   *
   * @param direction - Current direction in degrees
   * @param tileTypes - List of tile types for check
   * @param ground - Flag for check ground tile
   */
  public getCollide(
    direction: number,
    tileTypes: TileType[],
    ground: boolean = true,
  ): boolean | Phaser.GameObjects.Image {
    const target = this.scene.physics.velocityFromAngle(direction, WORLD_COLLIDE_LOOK);
    const occupiedTiles = this.getCorners().map((point) => Level.ToMatrixPosition({
      x: point.x + target.x,
      y: point.y + target.y,
    }));

    for (const positionAtMatrix of occupiedTiles) {
      // If collide tile
      const tile = this.scene.level.getTileWithType({ ...positionAtMatrix, z: 1 }, tileTypes);
      if (tile) {
        return tile;
      }

      // If not collide ground tile
      if (ground) {
        const tileGround = this.scene.level.getTile({ ...positionAtMatrix, z: 0 });
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
    const { position: { x, y }, width } = this.body;
    const count = 8;
    const r = width / 2;
    const l = Phaser.Math.PI2 / count;

    const points: Phaser.Types.Math.Vector2Like[] = [];
    for (let u = 0; u < count; u++) {
      points.push({
        x: (x + r) + Math.sin(u * l) * r,
        y: (y + r) - Math.cos(u * l) * r,
      });
    }

    return points;
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

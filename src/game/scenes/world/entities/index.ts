import Phaser from 'phaser';

import type { WorldScene } from '..';
import { WORLD_COLLIDE_SPEED_FACTOR } from '../const';
import type { Particles } from '../fx-manager/particles';
import type { IParticlesParent } from '../fx-manager/particles/types';
import { Level } from '../level';
import type { LevelBiome, PositionAtMatrix, TileType, PositionAtWorld } from '../level/types';

import { Indicator } from './addons/indicator';
import { Live } from './addons/live';
import { LiveEvent } from './addons/live/types';
import { EntityType } from './types';
import type { SpriteData, SpriteBodyData, SpriteIndicatorData } from './types';

import { isPositionsEqual } from '~core/dimension';

export abstract class Sprite extends Phaser.Physics.Arcade.Sprite implements IParticlesParent {
  declare public readonly scene: WorldScene;

  declare public readonly body: Phaser.Physics.Arcade.Body;

  public readonly live: Live;

  public gamut: number = 0;

  public speed: number = 0;

  public effects: Map<string, Particles> = new Map();

  public currentBiome: Nullable<LevelBiome> = null;

  private collisionTargets: TileType[] = [];

  private collisionHandler: Nullable<(tile: Phaser.GameObjects.Image) => void> = null;

  private collisionGround: boolean = false;

  private indicators: Phaser.GameObjects.Container;

  private _container: Phaser.GameObjects.Container;
  public get container() { return this._container; }
  private set container(v) { this._container = v; }

  private _positionAtMatrix: PositionAtMatrix;
  public get positionAtMatrix() { return this._positionAtMatrix; }
  private set positionAtMatrix(v) { this._positionAtMatrix = v; }

  constructor(scene: WorldScene, {
    texture, positionAtWorld, positionAtMatrix, speed, body, health = 1, frame = 0,
  }: SpriteData) {
    let position: Nullable<PositionAtWorld> = null;

    if (positionAtWorld) {
      position = positionAtWorld;
    } else if (positionAtMatrix) {
      position = Level.ToWorldPosition(positionAtMatrix);
    } else {
      throw Error('Invalid sprite position');
    }

    super(scene, position.x, position.y, texture, frame);
    scene.add.existing(this);
    scene.addEntityToGroup(this, EntityType.SPRITE);

    this.live = new Live({ health });
    this.speed = speed;

    this.configureBody(body);
    this.updateDimension();
    this.addContainer();
    this.addIndicatorsContainer();

    this.live.on(LiveEvent.DAMAGE, this.onDamage.bind(this));
    this.live.on(LiveEvent.DEAD, this.onDead.bind(this));
    this.live.on(LiveEvent.HEAL, this.onHeal.bind(this));

    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.container.destroy();
      this.live.destroy();
    });
  }

  public update() {
    try {
      this.updateDimension();
      this.updateContainer();
      this.updateIndicators();
    } catch (error) {
      console.warn('Failed to update sprite', error as TypeError);
    }
  }

  private updateDimension() {
    const positionOnGround = this.getBottomEdgePosition();

    this.positionAtMatrix = Level.ToMatrixPosition(positionOnGround);
    this.currentBiome = this.scene.level.map.getAt(this.positionAtMatrix);

    this.setDepth(positionOnGround.y);
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

  protected addCollider(target: EntityType, mode: 'overlap' | 'collider', callback: (sprite: any) => void) {
    this.scene.physics.add[mode](
      this,
      this.scene.getEntitiesGroup(target),
      (_, sprite) => {
        try {
          callback(sprite);
        } catch (error) {
          console.warn(`Failed to handle sprite ${mode} with ${target.toLowerCase()}`, error as TypeError);
        }
      },
    );
  }

  protected setTilesCollision(
    targets: TileType[],
    handler: (tile: Phaser.GameObjects.Image) => void,
  ) {
    this.collisionTargets = targets;
    this.collisionHandler = handler;
  }

  protected setTilesGroundCollision(state: boolean) {
    this.collisionGround = state;
  }

  protected handleCollide(direction: number) {
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
      const currentPositionAtWorld = this.getBottomEdgePosition();
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

  public getBottomEdgePosition(): PositionAtWorld {
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
    const position = this.getBottomEdgePosition();
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

  protected addIndicator(key: string, data: SpriteIndicatorData) {
    const indicator = new Indicator(this, {
      ...data,
      size: this.displayWidth,
    });

    indicator.setPosition(0, this.indicators.length * -5);
    indicator.setName(key);

    this.indicators.add(indicator);
  }

  protected getIndicator(key: string) {
    return this.indicators.getByName<Indicator>(key) ?? null;
  }

  private updateIndicators() {
    this.indicators.each((indicator: Indicator) => {
      indicator.updateValue();
    });
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  protected onDamage(amount: number) {
    //
  }

  protected onDead() {
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

  protected onHeal() {
    this.scene.fx.createHealEffect(this);
  }
}

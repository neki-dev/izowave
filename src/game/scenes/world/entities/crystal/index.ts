import Phaser from 'phaser';

import type { WorldScene } from '../..';
import { EntityType } from '../types';

import { CRYSTAL_RESOURCES, CRYSTAL_RESOURCES_GROWTH, CRYSTAL_RESOURCES_GROWTH_MAX_LEVEL, CRYSTAL_TILE } from './const';
import { CrystalAudio, CrystalTexture, CrystalEvents } from './types';
import type { CrystalData, CrystalSavePayload } from './types';

import { progressionLinear } from '~core/progression';
import { ShaderType } from '~core/shader/types';
import { Level } from '~scene/world/level';
import type { ITile } from '~scene/world/level/tile-matrix/types';
import type { PositionAtMatrix } from '~scene/world/level/types';
import { TileType } from '~scene/world/level/types';

import './resources';

export class Crystal extends Phaser.GameObjects.Image implements ITile {
  declare public readonly scene: WorldScene;

  public readonly tileType: TileType = TileType.CRYSTAL;

  public readonly positionAtMatrix: PositionAtMatrix;

  constructor(scene: WorldScene, {
    positionAtMatrix, variant = 0,
  }: CrystalData) {
    const positionAtWorld = Level.ToWorldPosition(positionAtMatrix);

    super(scene, positionAtWorld.x, positionAtWorld.y, CrystalTexture.CRYSTAL, variant);
    scene.add.existing(this);
    scene.addEntityToGroup(this, EntityType.CRYSTAL);

    this.positionAtMatrix = positionAtMatrix;

    if (this.scene.game.isDesktop()) {
      this.setInteractive({
        pixelPerfect: true,
      });

      this.handlePointer();
    }

    this.setDepth(positionAtWorld.y);
    this.setOrigin(0.5, CRYSTAL_TILE.origin);
    this.scene.level.putTile(this, { ...positionAtMatrix, z: 1 });
  }

  public pickup() {
    const resources = this.getResourcesAmount();

    this.scene.player.giveResources(resources);

    this.scene.getEntitiesGroup(EntityType.CRYSTAL)
      .emit(CrystalEvents.PICKUP, this, resources);

    this.scene.fx.playSound(CrystalAudio.PICKUP);

    this.destroy();
  }

  private getResourcesAmount() {
    const amount = progressionLinear({
      defaultValue: CRYSTAL_RESOURCES,
      scale: CRYSTAL_RESOURCES_GROWTH,
      level: this.scene.wave.number,
      maxLevel: CRYSTAL_RESOURCES_GROWTH_MAX_LEVEL,
    });

    return Phaser.Math.Between(
      amount - Math.floor(amount * 0.25),
      amount + Math.floor(amount * 0.25),
    );
  }

  public getSavePayload(): CrystalSavePayload {
    return {
      position: this.positionAtMatrix,
    };
  }

  private handlePointer() {
    this.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (this.scene.builder.isBuild) {
        return;
      }

      this.addShader(ShaderType.OUTLINE, {
        size: 2.0,
        color: 0xffffff,
      });
    });

    this.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.removeShader(ShaderType.OUTLINE);
    });
  }
}

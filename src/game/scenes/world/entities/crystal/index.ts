import Phaser from 'phaser';

import type { WorldScene } from '../..';
import { EntityType } from '../types';

import { CRYSTAL_TILE } from './const';
import { CrystalAudio, CrystalTexture, CrystalEvents } from './types';
import type { CrystalData, CrystalSavePayload } from './types';

import { DIFFICULTY } from '~game/difficulty';
import { progressionLinear } from '~lib/progression';
import { ShaderType } from '~lib/shader/types';
import { Level } from '~scene/world/level';
import type { ITile } from '~scene/world/level/tile-matrix/types';
import type { PositionAtMatrix } from '~scene/world/level/types';
import { TileType } from '~scene/world/level/types';

import './resources';

export class Crystal extends Phaser.GameObjects.Image implements ITile {
  readonly scene: WorldScene;

  readonly tileType: TileType = TileType.CRYSTAL;

  readonly positionAtMatrix: PositionAtMatrix;

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
      defaultValue: DIFFICULTY.CRYSTAL_RESOURCES,
      scale: DIFFICULTY.CRYSTAL_RESOURCES_GROWTH,
      level: this.scene.wave.number,
      maxLevel: DIFFICULTY.CRYSTAL_RESOURCES_GROWTH_MAX_LEVEL,
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

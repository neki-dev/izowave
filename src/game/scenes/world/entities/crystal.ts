import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { CRYSTAL_TILE } from '~const/world/entities/crystal';
import { Assets } from '~lib/assets';
import { progressionLinear } from '~lib/progression';
import { Level } from '~scene/world/level';
import { ShaderType } from '~type/shader';
import { IWorld } from '~type/world';
import { EntityType } from '~type/world/entities';
import {
  CrystalTexture, CrystalData, CrystalAudio, ICrystal, CrystalSavePayload, CrystalEvents,
} from '~type/world/entities/crystal';
import { TileType, PositionAtMatrix } from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

Assets.RegisterAudio(CrystalAudio);
Assets.RegisterSprites(CrystalTexture, CRYSTAL_TILE);

export class Crystal extends Phaser.GameObjects.Image implements ICrystal, ITile {
  readonly scene: IWorld;

  readonly tileType: TileType = TileType.CRYSTAL;

  readonly positionAtMatrix: PositionAtMatrix;

  constructor(scene: IWorld, {
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

    this.scene.sound.play(CrystalAudio.PICKUP);

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

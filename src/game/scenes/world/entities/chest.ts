import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { TILE_META } from '~const/world/level';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { Level } from '~scene/world/level';
import { IWorld } from '~type/world';
import {
  ChestTexture, ChestData, ChestAudio, IChest,
} from '~type/world/entities/chest';
import { TileType } from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

export class Chest extends Phaser.GameObjects.Image implements IChest, ITile {
  readonly scene: IWorld;

  readonly tileType: TileType = TileType.CHEST;

  constructor(scene: IWorld, {
    positionAtMatrix, variant = 0,
  }: ChestData) {
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);

    super(scene, positionAtWorld.x, positionAtWorld.y + 16, ChestTexture.CHEST, variant);
    scene.add.existing(this);
    scene.entityGroups.chests.add(this);

    const isVisibleTile = this.scene.level.isVisibleTile({ ...positionAtMatrix, z: 0 });

    this.setVisible(isVisibleTile);

    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.setOrigin(0.5, TILE_META.origin);
    this.scene.level.putTile(this, tilePosition);
  }

  public open() {
    const resources = calcGrowth(
      Phaser.Math.Between(
        DIFFICULTY.CHEST_RESOURCES - Math.floor(DIFFICULTY.CHEST_RESOURCES * 0.5),
        DIFFICULTY.CHEST_RESOURCES + Math.floor(DIFFICULTY.CHEST_RESOURCES * 0.5),
      ),
      DIFFICULTY.CHEST_RESOURCES_GROWTH,
      this.scene.wave.number,
    );

    this.scene.player.giveResources(resources);

    const experience = calcGrowth(
      DIFFICULTY.CHEST_EXPERIENCE,
      DIFFICULTY.CHEST_EXPERIENCE_GROWTH,
      this.scene.wave.number,
    );

    this.scene.player.giveExperience(experience);

    this.scene.sound.play(ChestAudio.OPEN);

    this.destroy();
  }
}

registerAudioAssets(ChestAudio);
registerSpriteAssets(ChestTexture, {
  width: 18,
  height: 20,
});

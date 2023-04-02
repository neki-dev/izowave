import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { TILE_META } from '~const/world/level';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { ChestTexture, ChestData, ChestAudio } from '~type/world/entities/chest';
import { TileType, Vector2D } from '~type/world/level';

export class Chest extends Phaser.GameObjects.Image {
  readonly scene: World;

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: Vector2D;

  /**
   * Chest constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, variant = 0,
  }: ChestData) {
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);

    super(scene, positionAtWorld.x, positionAtWorld.y + 16, ChestTexture.CHEST, variant);
    scene.add.existing(this);
    scene.entityGroups.chests.add(this);

    this.positionAtMatrix = positionAtMatrix;

    // Configure tile
    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.setOrigin(0.5, TILE_META.origin);
    scene.level.putTile(this, TileType.CHEST, tilePosition);
  }

  /**
   * Take resources from chest and destroy him.
   */
  public open() {
    const waveNumber = this.scene.wave.getCurrentNumber();

    // Give resources
    const resources = calcGrowth(
      Phaser.Math.Between(
        DIFFICULTY.CHEST_RESOURCES - Math.floor(DIFFICULTY.CHEST_RESOURCES * 0.5),
        DIFFICULTY.CHEST_RESOURCES + Math.floor(DIFFICULTY.CHEST_RESOURCES * 0.5),
      ),
      DIFFICULTY.CHEST_RESOURCES_GROWTH,
      waveNumber,
    );

    this.scene.player.giveResources(resources);

    // Give experience
    const experience = calcGrowth(
      DIFFICULTY.CHEST_EXPERIENCE,
      DIFFICULTY.CHEST_EXPERIENCE_GROWTH,
      waveNumber,
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

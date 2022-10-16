import Phaser from 'phaser';

import { DIFFICULTY } from '~const/difficulty';
import { registerAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { Level } from '~scene/world/level';
import { ChestTexture, ChestData } from '~type/world/entities/chest';
import { TileType } from '~type/world/level';

export class Chest extends Phaser.GameObjects.Image {
  // @ts-ignore
  readonly scene: World;

  /**
   * Position at matrix.
   */
  readonly positionAtMatrix: Phaser.Types.Math.Vector2Like;

  /**
   * Chest constructor.
   */
  constructor(scene: World, {
    positionAtMatrix, variant = 0,
  }: ChestData) {
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition({ ...tilePosition, z: 0 });

    super(scene, positionAtWorld.x, positionAtWorld.y + 2, ChestTexture.DEFAULT, variant);
    scene.add.existing(this);
    scene.chests.add(this);

    this.positionAtMatrix = positionAtMatrix;

    // Configure tile
    this.setDepth(Level.GetDepth(positionAtWorld.y - 10, tilePosition.z, this.displayHeight));
    this.setOrigin(0.5, 0.75);
    scene.level.putTile(this, TileType.CHEST, tilePosition);
    this.on(Phaser.GameObjects.Events.DESTROY, () => {
      scene.level.removeTile(tilePosition);
    });
  }

  /**
   * Take resources from chest and destroy it.
   */
  public open() {
    const { player, wave } = this.scene;
    const waveNumber = wave.number + 1;

    // Give resources
    const resources = Object.entries(DIFFICULTY.CHEST_RESOURCES).reduce((curr, [type, amount]) => {
      // Randomizing amount
      let totalAmount = Phaser.Math.Between(
        amount - Math.floor(amount * 0.5),
        amount + Math.floor(amount * 0.5),
      );
        // Update amount by wave number

      totalAmount = calcGrowth(
        totalAmount,
        DIFFICULTY.CHEST_RESOURCES_GROWTH,
        waveNumber,
      );

      return { ...curr, [type]: totalAmount };
    }, {});

    player.giveResources(resources);

    // Give experience
    const experience = calcGrowth(
      DIFFICULTY.CHEST_EXPERIENCE,
      DIFFICULTY.CHEST_EXPERIENCE_GROWTH,
      waveNumber,
    );

    player.giveExperience(experience);

    this.destroy();
  }
}

registerAssets([{
  key: ChestTexture.DEFAULT,
  type: 'spritesheet',
  url: `assets/sprites/${ChestTexture.DEFAULT}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: 18,
    frameHeight: 20,
  },
}]);

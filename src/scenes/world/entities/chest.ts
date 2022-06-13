import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import Level from '~scene/world/level';
import World from '~scene/world';

import { ChestTexture, ChestData } from '~type/chest';
import { TileType } from '~type/level';

import {
  CHEST_EXPERIENCE, CHEST_EXPERIENCE_GROWTH,
  CHEST_RESOURCES, CHEST_RESOURCES_GROWTH,
} from '~const/difficulty';

export default class Chest extends Phaser.GameObjects.Image {
  // @ts-ignore
  readonly scene: World;

  /**
   * Chest constructor.
   */
  constructor(scene: World, {
    position, variant = 0,
  }: ChestData) {
    const tilePosition = { ...position, z: 1 };
    const positionAtWorld = Level.ToWorldPosition({ ...tilePosition, z: 0 });
    super(scene, positionAtWorld.x, positionAtWorld.y + 2, ChestTexture.DEFAULT, variant);
    scene.add.existing(this);
    scene.getChests().add(this);

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
    const resources = Object.entries(CHEST_RESOURCES).reduce((curr, [type, amount]) => {
      // Randomizing amount
      let totalAmount = Phaser.Math.Between(
        amount - Math.floor(amount * 0.5),
        amount + Math.floor(amount * 0.5),
      );
        // Update amount by wave number
      totalAmount = calcGrowth(totalAmount, CHEST_RESOURCES_GROWTH, waveNumber);
      return { ...curr, [type]: totalAmount };
    }, {});
    player.giveResources(resources);
    player.addLabel(Object.entries(resources).map(([type, amount]) => (
      `+${amount} ${type}`
    )).join('\n'));

    // Give experience
    const experience = calcGrowth(CHEST_EXPERIENCE, CHEST_EXPERIENCE_GROWTH, waveNumber);
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

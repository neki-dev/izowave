import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import Text from '~ui/text';
import Player from '~scene/world/entities/player';
import Building from '~scene/world/entities/building';

import { ResourceType } from '~type/building';
import { InterfaceSprite, UIComponent } from '~type/interface';

type Props = {
  buildings: Phaser.GameObjects.Group
  player: Player
  x: number
  y: number
};

const RESOURCE_FRAME: {
  [value in ResourceType]: number
} = {
  [ResourceType.BRONZE]: 0,
  [ResourceType.SILVER]: 1,
  [ResourceType.GOLD]: 2,
};

const Component: UIComponent<Props> = function ComponentResources(
  this: Phaser.Scene,
  {
    buildings, player, x, y,
  },
) {
  const container = this.add.container(x + 10, y + 5);

  Object.values(ResourceType).forEach((type, index) => {
    const shift = (index * 48);

    const mines = new Text(this, {
      position: {
        x: 0,
        y: shift + 11,
      },
      update: (self) => {
        const minesCount = buildings.getChildren().filter((building: Building) => (
          building.getVariantName().includes(type.toUpperCase())
        )).length;
        self.setText(String(minesCount));
      },
      origin: [1.0, 0.5],
      align: 'right',
      fontSize: 12,
    });

    const pointer = new Text(this, {
      position: {
        x: 9,
        y: shift + 9,
      },
      value: 'x',
      alpha: 0.75,
      origin: [0.5, 0.5],
      fontSize: 7,
      shadow: false,
    });

    const icon = this.add.image(19, shift + 9, InterfaceSprite.RESOURCES, RESOURCE_FRAME[type])
      .setScale(1.4)
      .setOrigin(0, 0.5);

    const text = new Text(this, {
      position: {
        x: 19 + icon.height + 14,
        y: shift,
      },
      value: type,
      fontSize: 10,
    });

    const amount = new Text(this, {
      position: {
        x: 19 + icon.height + 14,
        y: shift + 15,
      },
      update: (self) => {
        self.setText(String(player.getResource(type)));
      },
      fontSize: 14,
    });

    container.add([mines, pointer, icon, text, amount]);
  });

  return container
    .setName('ComponentResources');
};

registerAssets({
  key: InterfaceSprite.RESOURCES,
  type: 'spritesheet',
  url: 'assets/interface/icons/resources.png',
  // @ts-ignore
  frameConfig: {
    frameWidth: 14,
    frameHeight: 14,
  },
});

export default Component;

import Phaser from 'phaser';
import { registerAssets } from '~lib/assets';
import Text from '~ui/text';
import Player from '~scene/world/entities/player';

import { ResourceType } from '~type/building';
import { InterfaceSprite, UIComponent } from '~type/interface';

type Props = {
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
  { player, x, y },
) {
  const container = this.add.container(x, y);

  let shift = 0;
  for (const type of Object.values(ResourceType)) {
    const body = this.add.rectangle(0, shift, 100, 34, 0x000000, 0.75);
    body.setOrigin(0, 0);

    const icon = this.add.image(7, shift + 7, InterfaceSprite.RESOURCES, RESOURCE_FRAME[type]);
    icon.setScale(1.4);
    icon.setOrigin(0, 0);

    const text = new Text(this, {
      position: {
        x: icon.width + 18,
        y: shift + 6,
      },
      value: type,
      fontSize: 7,
      origin: [0, 0],
    });

    const amount = new Text(this, {
      position: {
        x: icon.width + 18,
        y: shift + 14,
      },
      update: (self) => {
        self.setText(String(player.getResource(type)));
      },
      fontSize: 14,
      origin: [0, 0],
    });

    container.add([body, icon, text, amount]);
    shift += body.height + 5;
  }

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

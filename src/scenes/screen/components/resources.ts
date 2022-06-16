import Component from '~lib/ui';
import { registerAssets } from '~lib/assets';
import Player from '~scene/world/entities/player';

import { ResourceType } from '~type/building';
import { InterfaceSprite } from '~type/interface';
import { INTERFACE_PIXEL_FONT } from '~const/interface';

type Props = {
  player: Player
};

const RESOURCE_FRAME: {
  [value in ResourceType]: number
} = {
  [ResourceType.BRONZE]: 0,
  [ResourceType.SILVER]: 1,
  [ResourceType.GOLD]: 2,
};

const ITEM_HEIGHT = 34;
const ITEM_PADDING = 5;

export default Component(function ComponentResouces(container, { player }: Props) {
  Object.values(ResourceType).forEach((type, index) => {
    const item = this.add.container(0, ((ITEM_HEIGHT + ITEM_PADDING) * index));

    const body = this.add.rectangle(0, 0, 100, ITEM_HEIGHT, 0x000000, 0.75);
    body.setOrigin(0, 0);

    const icon = this.add.image(7, 7, InterfaceSprite.RESOURCES, RESOURCE_FRAME[type]);
    icon.setScale(1.4);
    icon.setOrigin(0, 0);

    const text = this.add.text(icon.width + 18, 6, type, {
      fontSize: '7px',
      fontFamily: INTERFACE_PIXEL_FONT,
    });

    const amount = this.add.text(icon.width + 18, 14, type, {
      fontSize: '14px',
      fontFamily: INTERFACE_PIXEL_FONT,
    });

    item.add([body, icon, text, amount]);
    container.add(item);
  });

  return {
    update: () => {
      Object.values(ResourceType).forEach((type, index) => {
        const item = <Phaser.GameObjects.Container> container.getAt(index);
        const amount = <Phaser.GameObjects.Text> item.getAt(3);
        amount.setText(String(player.getResource(type)));
      });
    },
  };
});

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

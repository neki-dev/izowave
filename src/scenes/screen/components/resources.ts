import Component from '~lib/ui';
import Player from '~scene/world/entities/player';

import { ResourceType } from '~type/building';
import { INTERFACE_PIXEL_FONT, RESOURCE_COLOR } from '~const/interface';

type Props = {
  player: Player
};

const ITEM_HEIGHT = 36;
const ITEM_MARGIN = 8;
const ITEM_PADDING = 8;

export default Component(function ComponentResouces(container, { player }: Props) {
  Object.values(ResourceType).forEach((type, index) => {
    const item = this.add.container(0, ((ITEM_HEIGHT + ITEM_MARGIN) * index));

    const body = this.add.rectangle(0, 0, 100, ITEM_HEIGHT, 0x000000, 0.75);
    body.setOrigin(0, 0);

    const size = ITEM_HEIGHT - (ITEM_PADDING * 2);
    const icon = this.add.rectangle(ITEM_PADDING, ITEM_PADDING, size, size, RESOURCE_COLOR[type]);
    icon.setOrigin(0, 0);

    const text = this.add.text(icon.width + 16, 6, type, {
      fontSize: '7px',
      fontFamily: INTERFACE_PIXEL_FONT,
      color: '#dddddd',
    });

    const amount = this.add.text(icon.width + 16, 15, type, {
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

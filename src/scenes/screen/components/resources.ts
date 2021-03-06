import Component from '~lib/ui';
import Player from '~scene/world/entities/player';
import ComponentAdditions from '~scene/screen/components/additions';

import { ResourceType } from '~type/building';
import { PlayerEvents } from '~type/player';

import { INTERFACE_FONT_PIXEL, RESOURCE_COLOR } from '~const/interface';

type Props = {
  player: Player
};

const CONTAINER_WIDTH = 100;
const ITEM_HEIGHT = 38;
const ITEM_MARGIN = 8;
const ITEM_PADDING = 8;

export default Component(function ComponentResouces(container, { player }: Props) {
  Object.values(ResourceType).forEach((type, index) => {
    const item = this.add.container(0, ((ITEM_HEIGHT + ITEM_MARGIN) * index));

    const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, ITEM_HEIGHT, 0x000000, 0.75);
    body.setOrigin(0.0, 0.0);

    const size = ITEM_HEIGHT - (ITEM_PADDING * 2);
    const icon = this.add.rectangle(ITEM_PADDING, ITEM_PADDING, size, size, RESOURCE_COLOR[type]);
    icon.setOrigin(0.0, 0.0);

    const text = this.add.text(icon.width + 16, ITEM_PADDING, type, {
      fontSize: '7px',
      fontFamily: INTERFACE_FONT_PIXEL,
      color: '#dddddd',
    });

    const amount = this.add.text(icon.width + 16, ITEM_HEIGHT - ITEM_PADDING - 1, type, {
      fontSize: '14px',
      fontFamily: INTERFACE_FONT_PIXEL,
    });
    amount.setName('Amount');
    amount.setOrigin(0.0, 1.0);

    const additions = ComponentAdditions.call(this, {
      x: CONTAINER_WIDTH + 10,
      y: ITEM_HEIGHT / 2,
    }, {
      combine: true,
      event: (callback: (amount: number) => void) => {
        player.on(PlayerEvents.RESOURCE, (resourceType: ResourceType, value: number) => {
          if (resourceType === type && value > 0) {
            callback(value);
          }
        });
      },
    });

    item.add([body, icon, text, amount, additions]);
    container.add(item);
  });

  return {
    update: () => {
      Object.values(ResourceType).forEach((type, index) => {
        const item = <Phaser.GameObjects.Container> container.getAt(index);
        const amount = <Phaser.GameObjects.Text> item.getByName('Amount');
        amount.setText(String(player.getResource(type)));
      });
    },
  };
});

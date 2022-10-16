import { INTERFACE_FONT, RESOURCE_COLOR } from '~const/interface';
import { Component } from '~lib/ui';
import { ComponentAdditions } from '~scene/screen/components/additions';
import { Player } from '~scene/world/entities/player';
import { PlayerEvents } from '~type/world/entities/player';
import { ResourceType } from '~type/world/resources';

type Props = {
  player: Player
};

const CONTAINER_WIDTH = 100;
const ITEM_HEIGHT = 38;
const ITEM_MARGIN = 8;
const ITEM_PADDING = 8;

export const ComponentResources = Component<Props>(function (container, {
  player,
}) {
  Object.values(ResourceType).forEach((type, index) => {
    const item = this.add.container(0, ((ITEM_HEIGHT + ITEM_MARGIN) * index));

    const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, ITEM_HEIGHT, 0x000000, 0.75);

    body.setOrigin(0.0, 0.0);

    const size = ITEM_HEIGHT - (ITEM_PADDING * 2);
    const icon = this.add.rectangle(ITEM_PADDING, ITEM_PADDING, size, size, RESOURCE_COLOR[type]);

    icon.setOrigin(0.0, 0.0);

    const text = this.add.text(icon.width + 16, ITEM_PADDING, type, {
      fontSize: '7px',
      fontFamily: INTERFACE_FONT.PIXEL,
      color: '#dddddd',
    });

    const amount = this.add.text(icon.width + 16, ITEM_HEIGHT - ITEM_PADDING - 1, type, {
      fontSize: '14px',
      fontFamily: INTERFACE_FONT.PIXEL,
    });

    amount.setName('Amount');
    amount.setOrigin(0.0, 1.0);

    const additions = ComponentAdditions.call(this, {
      x: CONTAINER_WIDTH + 10,
      y: ITEM_HEIGHT / 2,
    }, {
      combine: true,
      event: (callback: (value: number) => void) => {
        player.on(PlayerEvents.UPDATE_RESOURCE, (resourceType: ResourceType, value: number) => {
          if (resourceType === type) {
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

import Component from '~lib/ui';
import Player from '~scene/world/entities/player';

import { ResourceType } from '~type/building';
import { INTERFACE_FONT_MONOSPACE, INTERFACE_FONT_PIXEL, RESOURCE_COLOR } from '~const/interface';
import Building from '~scene/world/entities/building';

type Props = {
  player: Player
};

const CONTAINER_WIDTH = 100;
const ITEM_HEIGHT = 38;
const ITEM_MARGIN = 8;
const ITEM_PADDING = 8;

export default Component(function ComponentResouces(container, { player }: Props) {
  const buildings = player.scene.getBuildings();

  Object.values(ResourceType).forEach((type, index) => {
    const item = this.add.container(0, ((ITEM_HEIGHT + ITEM_MARGIN) * index));

    const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, ITEM_HEIGHT, 0x000000, 0.75);
    body.setOrigin(0, 0);

    const size = ITEM_HEIGHT - (ITEM_PADDING * 2);
    const icon = this.add.rectangle(ITEM_PADDING, ITEM_PADDING, size, size, RESOURCE_COLOR[type]);
    icon.setOrigin(0, 0);

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

    const count = this.add.text(CONTAINER_WIDTH + ITEM_PADDING, ITEM_HEIGHT / 2, '+0', {
      fontSize: '14px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
    });
    count.setName('Count');
    count.setOrigin(0.0, 0.5);
    count.setAlpha(0.5);

    item.add([body, icon, text, amount, count]);
    container.add(item);
  });

  return {
    update: () => {
      Object.values(ResourceType).forEach((type, index) => {
        const mines = buildings.getChildren().filter((building: Building) => (
          building.getName().includes(type.toUpperCase())
        ));
        const item = <Phaser.GameObjects.Container> container.getAt(index);
        const amount = <Phaser.GameObjects.Text> item.getByName('Amount');
        amount.setText(String(player.getResource(type)));
        const count = <Phaser.GameObjects.Text> item.getByName('Count');
        if (mines.length > 0) {
          count.setText(`+${mines.length}`);
          count.setVisible(true);
        } else {
          count.setVisible(false);
        }
      });
    },
  };
});

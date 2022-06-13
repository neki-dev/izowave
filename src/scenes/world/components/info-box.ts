import Phaser from 'phaser';
import Player from '~scene/world/entities/player';
import Rectangle from '~ui/rectangle';
import Text from '~ui/text';

import { InterfaceSprite, ResourcesSpriteFrames, UIComponent } from '~type/interface';
import { Resources, ResourceType } from '~type/building';

import { INTERFACE_ACTIVE_COLOR } from '~const/interface';

type Props = {
  label: () => string
  description: () => string
  cost?: () => Resources
  player: Player
};

const CONTAINER_WIDTH = 210;
const CONTAINER_PADDING = 15;

const Component: UIComponent<Props> = function ComponentInfoBox(
  this: Phaser.Scene,
  {
    label, description, cost, player,
  },
) {
  const container = this.add.container(0, 0);

  const body = new Rectangle(this, {
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    origin: [0, 0],
    alpha: 0.9,
  });

  let shift = CONTAINER_PADDING;
  const labelText = new Text(this, {
    position: { x: CONTAINER_PADDING, y: shift },
    origin: [0, 0],
    update: (self) => {
      const value = label();
      if (value !== undefined) {
        self.setText(value);
      }
    },
    color: INTERFACE_ACTIVE_COLOR,
    fontSize: 18,
    shadow: false,
  });
  shift += labelText.height + CONTAINER_PADDING * 0.75;

  const descriptionText = new Text(this, {
    position: { x: CONTAINER_PADDING, y: shift },
    origin: [0, 0],
    update: (self) => {
      const value = description();
      if (value !== undefined) {
        self.setText(value);
      }
    },
    shadow: false,
    space: 6,
  });
  shift += descriptionText.height + CONTAINER_PADDING;

  container.add([body, labelText, descriptionText]);

  if (cost) {
    const costText = this.add.container(CONTAINER_PADDING - 2, shift - 2);
    let offset = 0;
    for (const resource of Object.keys(ResourceType)) {
      const type = ResourceType[resource];
      const frame = ResourcesSpriteFrames[resource];
      const image = this.add.image(offset, 0, InterfaceSprite.RESOURCES, frame)
        .setOrigin(0, 0);
      offset += image.width + 4;
      const count = new Text(this, {
        position: { x: offset, y: 2 },
        update: (self) => {
          const value = cost();
          if (value !== undefined) {
            const amount = cost()[type] || 0;
            const isEnough = (player.getResource(type) >= amount);
            self
              .setText(String(amount))
              .setColor(isEnough ? '#ffffff' : '#ff4545');
          }
        },
        origin: [0, 0],
      });
      offset += count.width + 8;
      costText.add([image, count]);
    }
    costText.setSize(offset, 12);
    container.add(costText);
    shift += costText.height + CONTAINER_PADDING;
  }

  body.setSize(CONTAINER_WIDTH, shift);
  container.setSize(CONTAINER_WIDTH, shift);
  container.setDepth(9999);

  return container
    .setName('ComponentInfoBox');
};

export default Component;

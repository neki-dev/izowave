import Phaser from 'phaser';
import Player from '~scene/world/entities/player';
import Rectangle from '~ui/rectangle';
import Text from '~ui/text';

import { InterfaceSprite, ResourcesSpriteFrames, UIComponent } from '~type/interface';
import { Resources, ResourceType } from '~type/building';

import { INTERFACE_ACTIVE_COLOR, INTERFACE_BOX_COLOR, INTERFACE_MONOSPACE_FONT } from '~const/interface';

type Props = {
  label: () => string
  description: () => string
  cost?: () => Resources
  costTitle?: string
  player: Player
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 15;

const Component: UIComponent<Props> = function ComponentInfoBox(
  this: Phaser.Scene,
  {
    label, description, cost, costTitle, player,
  },
) {
  const container = this.add.container(0, 0);
  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const body = new Rectangle(this, {
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    origin: [0, 0],
    alpha: 0.9,
    background: INTERFACE_BOX_COLOR,
  });

  const labelText = new Text(this, {
    position: shift,
    origin: [0, 0],
    update: (self) => {
      const value = label();
      if (value !== undefined) {
        self.setText(value);
      }
    },
    color: INTERFACE_ACTIVE_COLOR,
    fontSize: 18,
  });
  shift.y += labelText.height + CONTAINER_PADDING * 0.6;

  const descriptionText = new Text(this, {
    position: shift,
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
  shift.y += descriptionText.height + CONTAINER_PADDING;

  // body.setSize(Math.max(labelText.width, descriptionText.width) + CONTAINER_PADDING * 2, shift.y);
  body.setSize(CONTAINER_WIDTH, shift.y);
  shift.x += body.width - CONTAINER_PADDING;

  container.add([body, labelText, descriptionText]);

  if (cost) {
    let offset = 12;
    const costContainer = this.add.container(shift.x, 0);
    const costBody = new Rectangle(this, {
      size: { x: 80, y: shift.y },
      position: { x: 0, y: 0 },
      origin: [0, 0],
      alpha: 0.9,
    });
    const constTitle = new Text(this, {
      position: { x: 10, y: offset },
      origin: [0, 0],
      value: costTitle.toUpperCase(),
      fontSize: 8,
      fontFamily: INTERFACE_MONOSPACE_FONT,
      shadow: false,
    });
    offset += constTitle.height + 8;
    costContainer.add([costBody, constTitle]);
    for (const resource of Object.keys(ResourceType)) {
      const resourceType = ResourceType[resource];
      const resourceIcon = this.add.image(10, offset, InterfaceSprite.RESOURCES, ResourcesSpriteFrames[resource]);
      resourceIcon.setScale(0.75);
      resourceIcon.setOrigin(0, 0);
      const countText = new Text(this, {
        position: { x: 10 + resourceIcon.width + 2, y: offset },
        update: (self) => {
          const value = cost();
          if (value !== undefined) {
            const costAmount = value[resourceType] || 0;
            const isEnough = (player.getResource(resourceType) >= costAmount);
            self.setText(String(costAmount));
            self.setColor(isEnough ? '#ffffff' : '#ff6d6d');
          }
        },
        origin: [0, 0],
        fontSize: 9,
        shadow: false,
      });
      offset += resourceIcon.height + 4;
      costContainer.add([resourceIcon, countText]);
    }
    container.add(costContainer);
    shift.x += 80;
  }

  container.setSize(shift.x, shift.y);
  container.setDepth(9999);

  return container
    .setName('ComponentInfoBox');
};

export default Component;

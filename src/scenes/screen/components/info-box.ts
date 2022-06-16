import Component from '~lib/ui';
import Player from '~scene/world/entities/player';

import { InterfaceSprite, ResourcesSpriteFrames } from '~type/interface';
import { Resources, ResourceType } from '~type/building';

import {
  INTERFACE_ACTIVE_COLOR, INTERFACE_BOX_COLOR, INTERFACE_MONOSPACE_FONT, INTERFACE_PIXEL_FONT,
} from '~const/interface';

type Props = {
  label: () => string
  description: () => string
  cost?: () => Resources
  costTitle?: string
  player: Player
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 15;

export default Component(function ComponentInfoBox(container, {
  label, description, cost, costTitle, player,
}: Props) {
  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 0, INTERFACE_BOX_COLOR, 0.9);
  body.setOrigin(0, 0);

  const labelText = this.add.text(shift.x, shift.y, label() || '', {
    fontSize: '18px',
    fontFamily: INTERFACE_PIXEL_FONT,
    color: INTERFACE_ACTIVE_COLOR,
  });
  shift.y += labelText.height + CONTAINER_PADDING * 0.6;

  const descriptionText = this.add.text(shift.x, shift.y, description() || '', {
    fontSize: '11px',
    fontFamily: INTERFACE_PIXEL_FONT,
    // @ts-ignore
    lineSpacing: 4,
  });
  shift.y += descriptionText.height + CONTAINER_PADDING;

  body.height = shift.y;
  shift.x += body.width - CONTAINER_PADDING;

  container.add([body, labelText, descriptionText]);

  const costItems = [];
  if (cost) {
    let offset = 12;
    const costContainer = this.add.container(shift.x, 0);
    const costBody = this.add.rectangle(0, 0, 80, shift.y, 0x000000, 0.9);
    costBody.setOrigin(0, 0);
    const constTitle = this.add.text(10, offset, costTitle.toUpperCase(), {
      fontSize: '8px',
      fontFamily: INTERFACE_MONOSPACE_FONT,
    });
    offset += constTitle.height + 7;
    costContainer.add([costBody, constTitle]);
    for (const resource of Object.keys(ResourceType)) {
      const resourceType = ResourceType[resource];
      const resourceIcon = this.add.image(10, offset, InterfaceSprite.RESOURCES, ResourcesSpriteFrames[resource]);
      resourceIcon.setScale(0.75);
      resourceIcon.setOrigin(0, 0);
      const countText = this.add.text(10 + resourceIcon.width + 2, offset, costTitle.toUpperCase(), {
        fontSize: '9px',
        fontFamily: INTERFACE_PIXEL_FONT,
        padding: { bottom: 1 },
      });
      offset += resourceIcon.displayHeight + 4;
      costContainer.add([resourceIcon, countText]);
      costItems.push({
        type: resourceType,
        text: countText,
      });
    }
    container.add(costContainer);
    shift.x += 80;
  }

  container.setSize(shift.x, shift.y);
  container.setDepth(9999);

  return {
    update: () => {
      const valueLabel = label();
      if (valueLabel !== undefined) {
        labelText.setText(valueLabel);
      }
      const valueDescription = description();
      if (valueDescription !== undefined) {
        descriptionText.setText(valueDescription);
      }
      const valueCost = cost();
      if (valueCost !== undefined) {
        for (const { type, text } of costItems) {
          const costAmount = valueCost[type] || 0;
          const isEnough = (player.getResource(type) >= costAmount);
          text.setText(String(costAmount));
          text.setColor(isEnough ? '#ffffff' : '#ff6d6d');
        }
      }
    },
  };
});

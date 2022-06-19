import Component from '~lib/ui';
import Player from '~scene/world/entities/player';

import { Resources, ResourceType } from '~type/building';

import {
  INTERFACE_ACTIVE_COLOR, INTERFACE_BOX_COLOR, INTERFACE_MONOSPACE_FONT, INTERFACE_PIXEL_FONT, RESOURCE_COLOR,
} from '~const/interface';
import { toEven } from '~lib/utils';

type Props = {
  label: () => string
  subLabel?: () => string
  description: () => string
  cost?: () => Resources
  costTitle?: string
  player: Player
};

const CONTAINER_WIDTH = 220;
const CONTAINER_PADDING = 14;

export default Component(function ComponentInfoBox(container, {
  label, subLabel, description, cost, costTitle, player,
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, 0, INTERFACE_BOX_COLOR, 0.9);
  body.setOrigin(0, 0);

  const shift = { x: CONTAINER_PADDING, y: CONTAINER_PADDING };

  const labelText = this.add.text(shift.x, shift.y, label() || '', {
    fontSize: '18px',
    fontFamily: INTERFACE_PIXEL_FONT,
    color: INTERFACE_ACTIVE_COLOR,
  });
  shift.y += toEven(labelText.height + CONTAINER_PADDING * 0.6);

  let subLabelText;
  if (subLabel) {
    subLabelText = this.add.text(shift.x, shift.y, subLabel() || '', {
      fontSize: '10px',
      fontFamily: INTERFACE_PIXEL_FONT,
      padding: { bottom: 1 },
    });
    shift.y += toEven(subLabelText.height + CONTAINER_PADDING * 0.6);
  }

  const descriptionText = this.add.text(shift.x, shift.y, description() || '', {
    fontSize: '10px',
    fontFamily: INTERFACE_PIXEL_FONT,
    padding: { bottom: 1 },
    // @ts-ignore
    lineSpacing: 5,
  });
  shift.y += descriptionText.height + CONTAINER_PADDING;

  body.height = shift.y;
  shift.x += body.width - CONTAINER_PADDING;

  container.add([body, labelText, descriptionText]);
  if (subLabelText) {
    container.add(subLabelText);
  }

  const costItems = [];
  if (cost) {
    let offset = 10;
    const costContainer = this.add.container(shift.x, 0);
    const costBody = this.add.rectangle(0, 0, 60, shift.y, 0x000000, 0.9);
    costBody.setOrigin(0, 0);
    const constTitle = this.add.text(10, offset, costTitle.toUpperCase(), {
      fontSize: '9px',
      fontFamily: INTERFACE_MONOSPACE_FONT,
    });
    offset += toEven(constTitle.height + 6);
    costContainer.add([costBody, constTitle]);
    for (const resource of Object.keys(ResourceType)) {
      const resourceType = ResourceType[resource];
      const resourceIcon = this.add.rectangle(10, offset, 8, 8, RESOURCE_COLOR[resourceType]);
      resourceIcon.setOrigin(0, 0);
      const countText = this.add.text(10 + resourceIcon.width + 5, offset - 1, costTitle.toUpperCase(), {
        fontSize: '9px',
        fontFamily: INTERFACE_PIXEL_FONT,
        padding: { bottom: 1 },
      });
      offset += toEven(resourceIcon.height + 6);
      costContainer.add([resourceIcon, countText]);
      costItems.push({
        type: resourceType,
        text: countText,
      });
    }
    container.add(costContainer);
    shift.x += costBody.width;
  }

  container.setSize(shift.x, shift.y);
  container.setDepth(9999);

  return {
    update: () => {
      const valueLabel = label();
      if (valueLabel !== undefined) {
        labelText.setText(valueLabel);
      }
      if (subLabel) {
        const valueSubLabel = subLabel();
        if (valueSubLabel !== undefined) {
          subLabelText.setText(valueSubLabel);
        }
      }
      const valueDescription = description();
      if (valueDescription !== undefined) {
        descriptionText.setText(valueDescription);
      }
      if (cost) {
        const valueCost = cost();
        if (valueCost !== undefined) {
          for (const { type, text } of costItems) {
            const costAmount = valueCost[type] || 0;
            const isEnough = (player.getResource(type) >= costAmount);
            text.setText(String(costAmount));
            text.setColor(isEnough ? '#ffffff' : '#ff6d6d');
          }
        }
      }
    },
  };
});

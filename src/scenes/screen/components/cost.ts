import {
  INTERFACE_TEXT_COLOR_ERROR, INTERFACE_FONT_MONOSPACE, RESOURCE_COLOR, INTERFACE_BOX_COLOR_BLUE_DARK,
} from '~const/interface';
import { Component } from '~lib/ui';
import { toEven } from '~lib/utils';
import { Resources, ResourceType } from '~type/building';

type Props = {
  label: string
  size: [number, number]
  need: () => Resources
  have: () => Resources
};

export const ComponentCost = Component<Props>(function (container, {
  label, size, need, have,
}) {
  const items = [];
  let offset = 10;

  container.setSize(size[0], size[1]);

  const body = this.add.rectangle(0, 0, container.width, container.height, INTERFACE_BOX_COLOR_BLUE_DARK, 0.9);
  body.setOrigin(0.0, 0.0);

  const title = this.add.text(10, offset, label, {
    fontSize: '9px',
    fontFamily: INTERFACE_FONT_MONOSPACE,
  });
  offset += toEven(title.height + 6);

  container.add([body, title]);

  for (const resource of Object.keys(ResourceType)) {
    const type = ResourceType[resource];
    const icon = this.add.rectangle(10, offset, 8, 8, RESOURCE_COLOR[type]);
    icon.setOrigin(0.0, 0.0);
    const text = this.add.text(10 + icon.width + 5, offset - 2, '0', {
      fontSize: '11px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
    });
    offset += icon.height + 6;
    container.add([icon, text]);
    items.push({ type, text });
  }

  return {
    update: () => {
      if (!container.visible) {
        return;
      }

      body.setSize(container.width, container.height);

      const needAmounts = need();
      if (!needAmounts) {
        return;
      }

      const haveAmounts = have();
      for (const { type, text } of items) {
        const haveAmount = haveAmounts[type] || 0;
        const needAmount = needAmounts[type] || 0;
        text.setText(String(needAmount));
        if (needAmount === 0) {
          text.setColor('#aaa');
        } else if (haveAmount < needAmount) {
          text.setColor(INTERFACE_TEXT_COLOR_ERROR);
        } else {
          text.setColor('#fff');
        }
      }
    },
  };
});

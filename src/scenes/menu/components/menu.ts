import { COPYRIGHT } from '~const/core';
import { INTERFACE_FONT_MONOSPACE, INTERFACE_FONT_PIXEL, INTERFACE_TEXT_COLOR_BLUE } from '~const/interface';
import { Component } from '~lib/ui';
import { MenuItem } from '~type/menu';

import { ComponentItems } from './items';

type Props = {
  menuItems: MenuItem[]
};

const CONTENT_WIDTH = 500;
const CONTENT_MARGIN = 200;

export const ComponentMenu = Component<Props>(function (container, {
  menuItems,
}) {
  const shift = { x: 0, y: 0 };
  const box = this.add.container(0, 0);

  const updateContent = (item: MenuItem) => {
    const title = <Phaser.GameObjects.Text> box.getByName('Title');

    title.setText(item.label);

    const content = <Phaser.GameObjects.Container> box.getByName('Content');

    content.each((child: Phaser.GameObjects.GameObject) => {
      child.destroy();
    });

    const value = item.content();

    content.add(value);
    content.setSize(value.width, value.height);
  };

  const background = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.85);

  background.setOrigin(0.0, 0.0);

  const logotype = this.add.text(shift.x, shift.y, 'IZOWAVE', {
    color: INTERFACE_TEXT_COLOR_BLUE,
    fontSize: '50px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 6 },
    shadow: {
      offsetX: 6,
      offsetY: 6,
      color: '#000',
      blur: 0,
      fill: true,
    },
  });

  shift.y += logotype.height + 80;

  const items = ComponentItems.call(this, shift, {
    width: logotype.width,
    data: menuItems,
    onSelect: (item: MenuItem) => updateContent(item),
  });

  shift.y += items.height + 100;

  const copyright = this.add.text(shift.x, shift.y, COPYRIGHT, {
    fixedWidth: logotype.width,
    fontSize: '12px',
    fontFamily: INTERFACE_FONT_MONOSPACE,
    align: 'right',
  });

  shift.y += copyright.height;
  shift.x = logotype.width;
  copyright.setAlpha(0.5);

  box.setSize(shift.x + CONTENT_MARGIN + CONTENT_WIDTH, shift.y);

  const line = this.add.rectangle(shift.x + CONTENT_MARGIN / 2, -100, 1, shift.y + 200, 0xffffff, 0.3);

  line.setOrigin(0.0, 0.0);
  shift.x += CONTENT_MARGIN;
  shift.y = 0;

  const title = this.add.text(shift.x, shift.y, '', {
    fontSize: '50px',
    fontFamily: INTERFACE_FONT_PIXEL,
    padding: { bottom: 6 },
    shadow: {
      offsetX: 6,
      offsetY: 6,
      color: '#000',
      blur: 0,
      fill: true,
    },
  });

  shift.y += title.height + 80;
  title.setAlpha(0.3);
  title.setName('Title');

  const content = this.add.container(shift.x, shift.y);

  content.setName('Content');

  box.add([logotype, items, copyright, line, title, content]);

  container.add([background, box]);

  const defaultItem = menuItems.find((item) => item.default);

  if (defaultItem) {
    updateContent(defaultItem);
  }

  return {
    resize: (width, height) => {
      background.setSize(width, height);
      box.setPosition(width / 2 - box.width / 2, height / 2 - box.height / 2);
    },
  };
});

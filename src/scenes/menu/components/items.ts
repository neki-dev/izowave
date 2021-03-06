import Phaser from 'phaser';
import Component from '~lib/ui';

import { INTERFACE_FONT_PIXEL, INTERFACE_TEXT_COLOR_ACTIVE, INTERFACE_TEXT_COLOR_PRIMARY } from '~const/interface';

export type MenuItem = {
  label: string
  default?: boolean
  content?: () => any
  onClick?: () => void
};

type Props = {
  width: number
  data: MenuItem[]
  onSelect: (item: MenuItem) => void
};

const MENU_ITEMS_MARGIN = 40;

export default Component(function ComponentItems(container, { width, data, onSelect }: Props) {
  let shift = 0;
  const active = { current: null };

  for (const item of data) {
    const text = this.add.text(width, shift, item.label, {
      color: '#fff',
      fontSize: '20px',
      fontFamily: INTERFACE_FONT_PIXEL,
      align: 'right',
      padding: { bottom: 4 },
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000',
        blur: 0,
        fill: true,
      },
    });
    text.setOrigin(1.0, 0.0);
    text.setInteractive();
    text.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
      text.setColor(item.onClick ? INTERFACE_TEXT_COLOR_PRIMARY : INTERFACE_TEXT_COLOR_ACTIVE);
    });
    text.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.input.setDefaultCursor('default');
      if (active.current !== text) {
        text.setColor('#fff');
      }
    });
    text.on(Phaser.Input.Events.POINTER_UP, () => {
      if (item.onClick) {
        item.onClick();
      } else if (item.content) {
        onSelect(item);
        if (active.current) {
          active.current.setColor('#fff');
        }
        text.setColor(INTERFACE_TEXT_COLOR_ACTIVE);
        active.current = text;
      }
    });
    container.add(text);
    shift += text.height + MENU_ITEMS_MARGIN;
    if (item.default) {
      active.current = text;
      text.setColor(INTERFACE_TEXT_COLOR_ACTIVE);
    }
  }

  container.setSize(width, shift - MENU_ITEMS_MARGIN);

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});

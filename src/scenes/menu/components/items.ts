import Phaser from 'phaser';
import Component from '~lib/ui';

import { INTERFACE_PIXEL_FONT, INTERFACE_PRIMARY_COLOR } from '~const/interface';

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
  for (const item of data) {
    const text = this.add.text(width, shift, item.label, {
      fixedWidth: width,
      color: item.onClick ? INTERFACE_PRIMARY_COLOR : '#ffffff',
      fontSize: '20px',
      fontFamily: INTERFACE_PIXEL_FONT,
      align: 'right',
      padding: { bottom: 4 },
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000000',
        blur: 0,
        fill: true,
      },
    });
    text.setOrigin(1.0, 0.0);
    text.setInteractive();
    text.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
      text.setScale(1.15);
    });
    text.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.input.setDefaultCursor('default');
      text.setScale(1.0);
    });
    text.on(Phaser.Input.Events.POINTER_UP, () => {
      if (item.onClick) {
        item.onClick();
      } else if (item.content) {
        onSelect(item);
      }
    });
    container.add(text);
    shift += text.height + MENU_ITEMS_MARGIN;
  }

  container.setSize(width, shift - MENU_ITEMS_MARGIN);

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});

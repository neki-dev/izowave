import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';

import { INTERFACE_PRIMARY_COLOR } from '~const/interface';

export type MenuItem = {
  label: string
  default?: boolean
  content?: () => any
  onClick?: () => void
};

type Props = {
  x: number
  y: number
  width: number
  data: MenuItem[]
  onSelect: (item: MenuItem) => void
};

const MENU_ITEMS_MARGIN = 40;

const Component: UIComponent<Props> = function ComponentItems(
  this: Phaser.Scene,
  {
    x, y, width, data, onSelect,
  },
) {
  const container = this.add.container(x, y);
  let shift = 0;

  for (const item of data) {
    const text = new Text(this, {
      position: { x: width, y: shift },
      size: { x: width },
      value: item.label,
      origin: [1, 0.5],
      alpha: 1.0,
      fontSize: 20,
      shadow: 4,
      color: item.onClick ? INTERFACE_PRIMARY_COLOR : '#ffffff',
      align: 'right',
    });
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

  container.on(Phaser.GameObjects.Events.DESTROY, () => {
    this.input.setDefaultCursor('default');
  });

  return container
    .setName('ComponentItems');
};

export default Component;

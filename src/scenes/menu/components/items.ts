import Phaser from 'phaser';
import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { Component } from '~lib/ui';
import { MenuItem } from '~type/menu';

type Props = {
  data: MenuItem[]
  onSelect: (item: MenuItem) => void
};

export const ComponentItems = Component<Props>(function (container, {
  data, onSelect,
}) {
  const active: {
    current: Phaser.GameObjects.Text
  } = { current: null };

  data.forEach((item, index) => {
    const text = this.add.text(0, 0, item.label, {
      resolution: window.devicePixelRatio,
      color: '#fff',
      fontFamily: INTERFACE_FONT.PIXEL,
      align: 'right',
      shadow: {
        color: '#000',
        blur: 0,
        fill: true,
      },
    });

    text.adaptive = () => {
      const fontSize = container.width / 214;
      const shadow = fontSize * 4;
      const margin = container.height * 0.1;

      text.setFontSize(`${fontSize}rem`);
      text.setShadowOffset(shadow, shadow);
      text.setPadding(0, 0, 0, shadow);
      text.setPosition(container.width, (text.height + margin) * index);
    };

    text.setOrigin(1.0, 0.0);
    text.setInteractive();

    text.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
      if (active.current !== text) {
        text.setColor(INTERFACE_TEXT_COLOR.PRIMARY);
      }
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
        text.setColor(INTERFACE_TEXT_COLOR.PRIMARY);
        active.current = text;
      }
    });

    container.add(text);

    if (item.default) {
      text.setColor(INTERFACE_TEXT_COLOR.PRIMARY);
      active.current = text;
    }
  });

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});

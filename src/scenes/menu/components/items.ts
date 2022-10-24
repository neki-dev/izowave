import Phaser from 'phaser';
import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { MenuAudio, MenuItem } from '~type/menu';

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
      fontFamily: INTERFACE_FONT.PIXEL,
      align: 'right',
      shadow: {
        fill: true,
      },
    });

    text.setOrigin(1.0, 0.0);
    text.setInteractive();
    useAdaptation(text, () => {
      const margin = container.height * 0.07;

      scaleText(text, {
        by: container.width,
        scale: 0.08,
        shadow: true,
      });
      text.setPosition(
        container.width,
        (text.height + margin) * index,
      );
    });

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
      this.sound.play(MenuAudio.CLICK);

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

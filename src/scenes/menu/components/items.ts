import Phaser from 'phaser';
import { INTERFACE_FONT, INTERFACE_TEXT_COLOR } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { MenuAudio, MenuItem } from '~type/menu';

type Props = {
  data: MenuItem[]
  onSelect: (index: number) => void
};

export const ComponentItems = Component<Props>(function (container, {
  data, onSelect,
}) {
  const ref: Record<string, {
    label?: Phaser.GameObjects.Text
  }> = {};

  const state: {
    current: Phaser.GameObjects.Text
  } = { current: null };

  /**
   * Creating
   */

  data.forEach(({
    label, content, onClick, active,
  }, index) => {
    ref[label] = {};

    /**
     * Label
     */

    container.add(
      ref[label].label = this.add.text(0, 0, label, {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.PIXEL,
        align: 'right',
        shadow: {
          fill: true,
        },
      }),
    );

    ref[label].label.setOrigin(1.0, 0.0);
    ref[label].label.setInteractive();
    useAdaptation(ref[label].label, () => {
      const margin = container.height * 0.07;

      scaleText(ref[label].label, 22, true);
      ref[label].label.setPosition(
        container.width,
        (ref[label].label.height + margin) * index,
      );
    });

    ref[label].label.on(Phaser.Input.Events.POINTER_OVER, () => {
      this.input.setDefaultCursor('pointer');
      if (state.current !== ref[label].label) {
        ref[label].label.setColor(INTERFACE_TEXT_COLOR.PRIMARY);
      }
    });

    ref[label].label.on(Phaser.Input.Events.POINTER_OUT, () => {
      this.input.setDefaultCursor('default');
      if (state.current !== ref[label].label) {
        ref[label].label.setColor('#fff');
      }
    });

    ref[label].label.on(Phaser.Input.Events.POINTER_UP, () => {
      this.sound.play(MenuAudio.CLICK);

      if (onClick) {
        onClick();
      } else if (content) {
        onSelect(index);
        if (state.current) {
          state.current.setColor('#fff');
        }
        ref[label].label.setColor(INTERFACE_TEXT_COLOR.PRIMARY);
        state.current = ref[label].label;
      }
    });

    if (active) {
      ref[label].label.setColor(INTERFACE_TEXT_COLOR.PRIMARY);
      state.current = ref[label].label;
    }
  });

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});

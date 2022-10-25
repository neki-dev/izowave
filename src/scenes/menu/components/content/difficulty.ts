import { DIFFICULTY_KEY } from '~const/core';
import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { keys } from '~lib/system';
import { useAdaptation, Component, scaleText } from '~lib/ui';
import { Difficulty } from '~type/core';

type Props = {
  disabled: boolean
};

export const ComponentDifficulty = Component<Props>(function (container, {
  disabled,
}) {
  const difficulty = {
    current: localStorage.getItem(DIFFICULTY_KEY),
  };

  keys(Difficulty).forEach((type, index) => {
    const name = this.add.text(0, 0, type, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      color: (difficulty.current === type) ? INTERFACE_TEXT_COLOR.ACTIVE : '#fff',
      shadow: {
        fill: true,
      },
    });

    useAdaptation(name, () => {
      const margin = container.height * 0.07;

      scaleText(name, {
        by: container.width,
        scale: 0.035,
        shadow: true,
      });
      name.setPosition(
        0,
        (name.height + margin) * index,
      );
    });

    name.setAlpha(disabled ? 0.5 : 1.0);

    if (!disabled) {
      name.setInteractive();

      name.on(Phaser.Input.Events.POINTER_OVER, () => {
        this.input.setDefaultCursor('pointer');
        if (difficulty.current !== type) {
          name.setColor(INTERFACE_TEXT_COLOR.ACTIVE);
        }
      });

      name.on(Phaser.Input.Events.POINTER_OUT, () => {
        this.input.setDefaultCursor('default');
        if (difficulty.current !== type) {
          name.setColor('#fff');
        }
      });

      name.on(Phaser.Input.Events.POINTER_UP, () => {
        container.each((child: Phaser.GameObjects.Text) => {
          child.setColor('#fff');
        });
        name.setColor(INTERFACE_TEXT_COLOR.ACTIVE);
        difficulty.current = type;

        localStorage.setItem(DIFFICULTY_KEY, type);
      });
    }

    container.add(name);
  });

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});

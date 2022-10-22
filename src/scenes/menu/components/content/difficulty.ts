import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { WORLD_DIFFICULTY_KEY } from '~const/world';
import { Component, scaleText } from '~lib/ui';
import { WorldDifficulty } from '~type/world';

type Props = {
  disabled: boolean
};

export const ComponentDifficulty = Component<Props>(function (container, {
  disabled,
}) {
  const difficulty = {
    current: localStorage.getItem(WORLD_DIFFICULTY_KEY),
  };

  Object.keys(WorldDifficulty).forEach((type, index) => {
    const name = this.add.text(0, 0, type, {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.PIXEL,
      color: (difficulty.current === type) ? INTERFACE_TEXT_COLOR.ACTIVE : '#fff',
      shadow: {
        fill: true,
      },
    });

    name.adaptive = () => {
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
    };

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

        localStorage.setItem(WORLD_DIFFICULTY_KEY, type);
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

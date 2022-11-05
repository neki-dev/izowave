import { INTERFACE_TEXT_COLOR, INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';
import { GameDifficulty } from '~type/game';

type Props = {
  disabled: boolean
};

export const ComponentDifficulty = Component<Props>(function (container, {
  disabled,
}) {
  const ref: Record<string, {
    type?: Phaser.GameObjects.Text
  }> = {};

  const state: {
    type: GameDifficulty
  } = {
    type: this.game.difficultyType,
  };

  /**
   * Creating
   */

  Object.keys(GameDifficulty).forEach((type: GameDifficulty, index) => {
    ref[type] = {};

    /**
     * Type
     */

    container.add(
      ref[type].type = this.add.text(0, 0, type, {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.PIXEL,
        color: (state.type === type) ? INTERFACE_TEXT_COLOR.ACTIVE : '#fff',
        shadow: {
          fill: true,
        },
      }),
    );

    ref[type].type.useAdaptationBefore(() => {
      scaleText(ref[type].type, 16, true);
      ref[type].type.setPosition(
        0,
        (ref[type].type.height + switchSize(10)) * index,
      );
    });

    ref[type].type.setAlpha(disabled ? 0.5 : 1.0);

    if (!disabled) {
      ref[type].type.setInteractive();

      ref[type].type.on(Phaser.Input.Events.POINTER_OVER, () => {
        this.input.setDefaultCursor('pointer');
        if (state.type !== type) {
          ref[type].type.setColor(INTERFACE_TEXT_COLOR.ACTIVE);
        }
      });

      ref[type].type.on(Phaser.Input.Events.POINTER_OUT, () => {
        this.input.setDefaultCursor('default');
        if (state.type !== type) {
          ref[type].type.setColor('#fff');
        }
      });

      ref[type].type.on(Phaser.Input.Events.POINTER_UP, () => {
        container.each((child: Phaser.GameObjects.Text) => {
          child.setColor('#fff');
        });
        ref[type].type.setColor(INTERFACE_TEXT_COLOR.ACTIVE);

        state.type = type;
        this.game.setDifficulty(type);
      });
    }
  });

  return {
    destroy: () => {
      this.input.setDefaultCursor('default');
    },
  };
});

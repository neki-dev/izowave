import { INTERFACE_FONT } from '~const/interface';
import { Component, scaleText } from '~lib/interface';
import { formatAmount, rawAmount } from '~lib/utils';

type Props = {
  event: (callback: (amount: number) => void) => void
};

export const ComponentAdditions = Component<Props>(function (container, {
  event,
}) {
  const ref: {
    addition?: Phaser.GameObjects.Text
  } = {};

  event((amount) => {
    if (ref.addition) {
      /**
       * Updating
       */

      ref.addition.setText(
        formatAmount(rawAmount(ref.addition.text) + amount),
      );

      return;
    }

    /**
     * Creating
     */

    container.add(
      ref.addition = this.add.text(0, 0, formatAmount(amount), {
        resolution: window.devicePixelRatio,
        fontFamily: INTERFACE_FONT.MONOSPACE,
      }),
    );

    ref.addition.setOrigin(0.0, 0.5);
    ref.addition.setAlpha(0.0);
    ref.addition.useAdaptationBefore(() => {
      scaleText(ref.addition, 13);
    });

    container.refreshAdaptation();

    this.tweens.add({
      targets: ref.addition,
      alpha: 0.75,
      duration: 250,
      hold: 1000,
      yoyo: true,
      ease: 'Linear',
      onComplete: () => {
        ref.addition.destroy();
        ref.addition = undefined;
      },
    });
  });
});

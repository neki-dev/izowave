import { INTERFACE_FONT } from '~const/interface';
import {
  useAdaptation, Component, scaleText, switchSize,
} from '~lib/ui';

type Props = {
  event: (callback: (amount: number) => void) => void
};

export const ComponentAdditions = Component<Props>(function (container, {
  event,
}) {
  const formatAmount = (amount: number): string => (
    `${(amount > 0) ? '+' : ''}${amount}`
  );

  event((amount) => {
    const additionExist = <Phaser.GameObjects.Text> container.getAt(0);

    if (additionExist) {
      const current = Number(additionExist.text.replace('+', ''));

      additionExist.setText(formatAmount(current + amount));

      return;
    }

    const addition = this.add.text(0, 0, formatAmount(amount), {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
    });

    addition.setOrigin(0.0, 0.5);
    addition.setAlpha(0.0);
    useAdaptation(addition, () => {
      scaleText(addition, { by: switchSize(14) });
    });

    container.add(addition);
    container.refreshAdaptive();

    this.tweens.add({
      targets: addition,
      alpha: 0.75,
      duration: 250,
      hold: 1000,
      yoyo: true,
      ease: 'Linear',
      onComplete: () => {
        addition.destroy();
      },
    });
  });
});

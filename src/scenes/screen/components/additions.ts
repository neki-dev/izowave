import { INTERFACE_FONT } from '~const/interface';
import { Component } from '~lib/ui';

type Props = {
  event: (callback: (amount: number) => void) => void
  combine?: boolean
};

export const ComponentAdditions = Component<Props>(function (container, {
  event, combine = false,
}) {
  const formatAmount = (amount: number): string => (
    `${(amount > 0) ? '+' : ''}${amount}`
  );

  const update = () => {
    let offset = 0;

    container.iterate((add: Phaser.GameObjects.Container) => {
      add.setX(offset);
      offset += add.width + (window.innerWidth * 0.005);
    });
  };

  event((amount) => {
    if (combine) {
      const addition = <Phaser.GameObjects.Text> container.getAt(0);

      if (addition) {
        const current = Number(addition.text.replace('+', ''));

        addition.setText(formatAmount(current + amount));

        return;
      }
    }

    const addition = this.add.text(0, 0, formatAmount(amount), {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
    });

    addition.setOrigin(0.0, 0.5);
    addition.setAlpha(0.0);
    addition.adaptive = (width) => {
      const fontSize = Math.max(0.6, width / 1800);

      addition.setFontSize(`${fontSize}rem`);
    };

    container.add(addition);
    container.refreshAdaptive();

    update();

    this.tweens.add({
      targets: addition,
      alpha: 0.75,
      duration: 250,
      hold: 1000,
      yoyo: true,
      ease: 'Linear',
      onComplete: () => {
        addition.destroy();
        update();
      },
    });
  });
});

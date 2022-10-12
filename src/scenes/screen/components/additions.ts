import { INTERFACE_FONT_MONOSPACE } from '~const/interface';
import { Component } from '~lib/ui';
import { toEven } from '~lib/utils';

type Props = {
  event: (callback: (amount: number) => void) => void
  combine?: boolean
};

const formatAmount = (amount: number): string => `${(amount > 0) ? '+' : ''}${amount}`;

export const ComponentAdditions = Component<Props>(function (container, {
  event, combine = false,
}) {
  const update = () => {
    let offset = 0;
    container.iterate((add: Phaser.GameObjects.Container) => {
      add.setX(offset);
      offset += toEven(add.width + 5);
    });
  };

  event((amount) => {
    if (combine) {
      const add = <Phaser.GameObjects.Text> container.getAt(0);
      if (add) {
        const current = Number(add.text.replace('+', ''));
        add.setText(formatAmount(current + amount));
        return;
      }
    }

    const add = this.add.text(0, 0, formatAmount(amount), {
      fontSize: '14px',
      fontFamily: INTERFACE_FONT_MONOSPACE,
    });
    add.setOrigin(0.0, 0.5);
    add.setAlpha(0.0);

    container.add(add);
    update();

    this.tweens.add({
      targets: add,
      alpha: 0.75,
      duration: 250,
      hold: 1000,
      yoyo: true,
      ease: 'Linear',
      onComplete: () => {
        add.destroy();
        update();
      },
    });
  });
});

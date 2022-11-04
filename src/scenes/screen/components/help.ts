import { INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';

type Props = {
  message: string
  side: 'right' | 'left'
};

export const ComponentHelp = Component<Props>(function (container, {
  message, side,
}) {
  const ref: {
    message?: Phaser.GameObjects.Text
    pointer?: Phaser.GameObjects.Triangle
  } = {};

  /**
   * Adaptation
   */

  container.useAdaptationAfter(() => {
    container.setSize(
      ref.message.width,
      ref.message.height,
    );
  });

  /**
   * Message
   */

  container.add(
    ref.message = this.add.text(0, 0, message.toUpperCase(), {
      resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
      backgroundColor: '#000',
    }),
  );

  if (side === 'right') {
    ref.message.setOrigin(1.0, 0.5);
  } else {
    ref.message.setOrigin(0.0, 0.5);
  }

  ref.message.useAdaptationBefore(() => {
    const padding = switchSize(10);

    scaleText(ref.message, 12);
    ref.message.setWordWrapWidth(switchSize(200));
    ref.message.setPadding(padding, padding * 0.7, padding, padding * 0.7);
  });

  /**
   * Pointer
   */

  const size = switchSize(8);

  container.add(
    ref.pointer = this.add.triangle(0, 0, 0, -size, (side === 'right') ? size : -size, 0, 0, size, 0x000000),
  );

  ref.pointer.setOrigin((side === 'right') ? 0.1 : 0.0, 0.0);

  /**
   * Animation
   */

  const tween = <Phaser.Tweens.Tween> this.tweens.add({
    targets: [ref.message, ref.pointer],
    x: switchSize(10) * ((side === 'right') ? -1 : 1),
    duration: 500,
    ease: 'Linear',
    yoyo: true,
    repeat: -1,
  });

  return {
    destroy: () => {
      tween.destroy();
    },
  };
});

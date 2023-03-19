import { INTERFACE_FONT } from '~const/interface';
import { Component, scaleText, switchSize } from '~lib/interface';

type Props = {
  message: string
  side: 'right' | 'left' | 'top'
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

  if (side === 'left') {
    ref.message.setOrigin(0.0, 0.5);
  } else if (side === 'right') {
    ref.message.setOrigin(1.0, 0.5);
  } else if (side === 'top') {
    ref.message.setOrigin(0.5, 0.0);
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
  let points: number[];

  if (side === 'left') {
    points = [0, -size, -size, 0, 0, size];
  } else if (side === 'right') {
    points = [0, -size, size, 0, 0, size];
  } else {
    points = [-size, 0, 0, -size, size, 0];
  }

  container.add(
    ref.pointer = this.add.triangle(0, 0, ...points, 0x000000),
  );

  ref.pointer.setOrigin((side === 'right') ? 0.1 : 0.0, 0.0);

  /**
   * Animation
   */

  const movings: {
    [key in string]: number
  } = {};

  if (side === 'left') {
    movings.x = switchSize(10);
  } else if (side === 'right') {
    movings.x = -switchSize(10);
  } else if (side === 'top') {
    movings.y = switchSize(10);
  }

  const tween = <Phaser.Tweens.Tween> this.tweens.add({
    ...movings,
    targets: [ref.message, ref.pointer],
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

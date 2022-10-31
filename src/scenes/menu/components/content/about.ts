/* eslint-disable max-len */
import { INTERFACE_FONT } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/ui';

export const ComponentAbout = Component(function (container) {
  const ref: {
    text?: Phaser.GameObjects.Text
  } = {};

  container.add(
    ref.text = this.add.text(0, -2, [
      'Your task is to survive as many waves as possible. With each wave, the number of enemies and their characteristics will grow.',
      '',
      'Between waves there are built walls to defend, towers to attack, mines to generation resources, and medics to replenish health.',
      '',
      'Also, do not forget to upgrade your buildings so as not to yield to enemies.',
    ], {
      // resolution: window.devicePixelRatio,
      fontFamily: INTERFACE_FONT.MONOSPACE,
      shadow: {
        fill: true,
      },
      // @ts-ignore
      lineSpacing: 6,
    }),
  );

  useAdaptation(ref.text, () => {
    ref.text.setWordWrapWidth(container.width);
    scaleText(ref.text, 14, true);
  });
});

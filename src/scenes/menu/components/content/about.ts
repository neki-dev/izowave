/* eslint-disable max-len */
import { INTERFACE_FONT } from '~const/interface';
import { useAdaptation, Component, scaleText } from '~lib/interface';

export const ComponentAbout = Component(function (container) {
  const ref: {
    text?: Phaser.GameObjects.Text
  } = {};

  container.add(
    ref.text = this.add.text(0, -2, [
      'Your task is to survive in open world as many waves as possible. With each wave count of enemies and their characteristics will grow.',
      '',
      'Between waves build walls to defend, towers to attack, generators to get resources, ammunitions to reload towers, and medics to replenish your health.',
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

import { INTERFACE_FONT } from '~const/interface';
import { Component } from '~lib/interface';

export const ComponentFPS = Component(function (container) {
  const ref: {
    value?: Phaser.GameObjects.Text
  } = {};

  const state: {
    value: number
  } = { value: null };

  /**
   * Creating
   */

  container.add(
    ref.value = this.add.text(0, 0, '', {
      // resolution: window.devicePixelRatio,
      fontSize: '12px',
      fontFamily: INTERFACE_FONT.MONOSPACE,
    }),
  );

  ref.value.setAlpha(0.5);

  /**
   * Updating
   */

  return {
    update: () => {
      const currentValue = Math.round(this.game.loop.actualFps);

      if (state.value !== currentValue) {
        ref.value.setText(`${currentValue} FPS`);

        state.value = currentValue;
      }
    },
  };
});

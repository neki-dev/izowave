import { INTERFACE_FONT } from '~const/interface';
import { Component } from '~lib/ui';

export const ComponentFPS = Component(function (container) {
  const value = this.add.text(0, 0, '', {
    resolution: window.devicePixelRatio,
    fontSize: '12px',
    fontFamily: INTERFACE_FONT.MONOSPACE,
  });

  value.setAlpha(0.5);

  container.add(value);

  return {
    update: () => {
      const count = Math.round(this.sys.game.loop.actualFps);

      value.setText(`${count} FPS`);
    },
  };
});

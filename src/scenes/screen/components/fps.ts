import Component from '~lib/ui';

import { INTERFACE_FONT_MONOSPACE } from '~const/interface';

export default Component(function ComponentFPS(container) {
  const fps = this.add.text(0, 0, '', {
    fontSize: '12px',
    fontFamily: INTERFACE_FONT_MONOSPACE,
  });
  fps.setAlpha(0.4);

  container.add(fps);

  return {
    update: () => {
      const count = Math.round(this.sys.game.loop.actualFps);
      fps.setText(`${count} FPS`);
    },
  };
});

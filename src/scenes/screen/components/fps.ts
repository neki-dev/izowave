import Component from '~lib/ui';

import { INTERFACE_MONOSPACE_FONT } from '~const/interface';

export default Component(function ComponentFPS(container) {
  const fps = this.add.text(0, 0, '', {
    fontSize: '12px',
    fontFamily: INTERFACE_MONOSPACE_FONT,
  });
  fps.setOrigin(1.0, 0.0);
  fps.setAlpha(0.4);

  container.add(fps);

  return {
    update: () => {
      fps.setText(`${Math.round(this.sys.game.loop.actualFps)} FPS`);
    },
  };
});

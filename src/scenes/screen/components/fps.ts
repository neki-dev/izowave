import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';

import { INTERFACE_MONOSPACE_FONT, INTERFACE_PADDING } from '~const/interface';

const Component: UIComponent = function ComponentFPS(
  this: Phaser.Scene,
) {
  const stat = new Text(this, {
    position: { x: this.sys.game.canvas.width - INTERFACE_PADDING, y: INTERFACE_PADDING },
    update: (self) => {
      self.setText(`${Math.round(this.sys.game.loop.actualFps)} FPS`);
    },
    fontFamily: INTERFACE_MONOSPACE_FONT,
    fontSize: 12,
    space: 10,
    origin: [1.0, 0],
    alpha: 0.4,
  });

  return stat
    .setName('ComponentFPS');
};

export default Component;

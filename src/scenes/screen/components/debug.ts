import Phaser from 'phaser';
import Text from '~ui/text';
import World from '~scene/world';

import { UIComponent } from '~type/interface';

import { INTERFACE_MONOSPACE_FONT, INTERFACE_PADDING } from '~const/interface';

type Props = {
  world: World
};

const Component: UIComponent<Props> = function ComponentDebug(
  this: Phaser.Scene,
) {
  const stat = new Text(this, {
    position: { x: this.sys.game.canvas.width - INTERFACE_PADDING, y: INTERFACE_PADDING },
    update: (self) => {
      self.setText([
        `FPS: ${Math.round(this.sys.game.loop.actualFps)}`,
        // @ts-ignore
        `MEM: ${Math.round((window.performance?.memory?.usedJSHeapSize || 0) / 1024 / 1024)}`,
      ]);
    },
    fontFamily: INTERFACE_MONOSPACE_FONT,
    fontSize: 12,
    space: 10,
    origin: [1.0, 0],
    alpha: 0.6,
  });

  return stat
    .setName('ComponentDebug');
};

export default Component;

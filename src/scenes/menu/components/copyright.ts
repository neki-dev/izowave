import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';

import { INTERFACE_MONOSPACE_FONT } from '~const/interface';
import { COPYRIGHT } from '~const/core';

type Props = {
  x: number
  y: number
  width: number
};

const Component: UIComponent<Props> = function ComponentCopyright(
  this: Phaser.Scene,
  { x, y, width },
) {
  return new Text(this, {
    position: { x, y },
    size: { x: width },
    value: COPYRIGHT,
    origin: [0, 0],
    alpha: 0.5,
    fontFamily: INTERFACE_MONOSPACE_FONT,
    fontSize: 12,
    align: 'right',
  })
    .setName('ComponentCopyright');
};

export default Component;

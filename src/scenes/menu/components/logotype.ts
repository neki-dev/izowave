import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';
import { INTERFACE_HEADER_COLOR } from '~const/interface';

type Props = {
  x: number
  y: number
  width: number
};

const Component: UIComponent<Props> = function ComponentLogotype(
  this: Phaser.Scene,
  { x, y, width },
) {
  return new Text(this, {
    position: { x: x + width, y },
    size: { x: width },
    value: 'IZOWAVE',
    origin: [1, 0],
    color: INTERFACE_HEADER_COLOR,
    fontSize: 50,
    shadow: 6,
  })
    .setName('ComponentLogotype');
};

export default Component;

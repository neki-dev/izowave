import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';

type Props = {
  x: number
  y: number
};

const Component: UIComponent<Props> = function ComponentTitle(
  this: Phaser.Scene,
  { x, y },
) {
  return new Text(this, {
    position: { x, y },
    value: '',
    origin: [0, 0],
    alpha: 0.3,
    fontSize: 50,
    shadow: 6,
  })
    .setName('ComponentTitle');
};

export default Component;

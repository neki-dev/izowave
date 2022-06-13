import Phaser from 'phaser';

import { UIComponent } from '~type/interface';

type Props = {
  x: number
  y: number
};

const Component: UIComponent<Props> = function ComponentContent(
  this: Phaser.Scene,
  { x, y },
) {
  return this.add.container(x, y - 10)
    .setName('ComponentContent');
};

export default Component;

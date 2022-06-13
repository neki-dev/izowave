import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';
import { INTERFACE_MONOSPACE_FONT } from '~const/interface';

const Component: UIComponent = function ComponentAbout(
  this: Phaser.Scene,
) {
  return new Text(this, {
    position: { x: 0, y: 0 },
    value: [
      'Your task is to survive as many waves as possible.',
      'With each wave, the number of enemies and their',
      'characteristics will grow.',
      '',
      'Between waves there are built walls to defend,',
      'towers to attack, mines to generation resources,',
      'and medics to replenish health.',
      '',
      'Also, do not forget to upgrade your buildings so',
      'as not to yield to enemies.',
    ],
    origin: [0, 0],
    fontFamily: INTERFACE_MONOSPACE_FONT,
    fontSize: 18,
  })
    .setName('ComponentAbout');
};

export default Component;

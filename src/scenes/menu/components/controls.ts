import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';

import { INTERFACE_BOX_COLOR } from '~const/interface';

function ComponentKey(
  this: Phaser.Scene,
  position: Phaser.Types.Math.Vector2Like,
  name: string,
  description: string,
) {
  const container = this.add.container(position.x, position.y);

  const textName = new Text(this, {
    position: { x: 5, y: 5 },
    value: name,
    origin: [0, 0],
    fontSize: 18,
    shadow: false,
  });

  const body = this.add.rectangle(0, 0, textName.width + 10, textName.height + 10, INTERFACE_BOX_COLOR);
  body.setOrigin(0, 0);

  const textDescription = new Text(this, {
    position: { x: body.width + 10, y: 7 },
    value: `-  ${description}`,
    origin: [0, 0],
    fontSize: 14,
  });

  container.add([body, textName, textDescription]);
  container.setSize(body.width + 10 + textDescription.width, body.height);

  return container
    .setName('ComponentKey');
}

const Component: UIComponent = function ComponentControls(
  this: Phaser.Scene,
) {
  const container = this.add.container(0, 0);
  let shift = 0;

  for (const item of [
    { name: 'W A S D', description: 'Move player' },
    { name: 'SPACE', description: 'Attack' },
    { name: 'LEFT CLICK', description: 'Build' },
    { name: 'DOUBLE CLICK', description: 'Upgrade building' },
    { name: 'BACKSPACE', description: 'Destroy building' },
    { name: 'N', description: 'Skip wave timeleft' },
    { name: 'ESC', description: 'Pause game' },
  ]) {
    const key = ComponentKey.call(this, { x: 0, y: shift }, item.name, item.description);
    container.add(key);
    shift += key.height + 15;
  }

  return container
    .setName('ComponentControls');
};

export default Component;

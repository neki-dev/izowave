import Phaser from 'phaser';
import Text from '~ui/text';

import { UIComponent } from '~type/interface';
import Rectangle from '~ui/rectangle';

function KeyItem(position: Phaser.Types.Math.Vector2Like, name: string, description: string) {
  const container = this.add.container(position.x, position.y);

  const textName = new Text(this, {
    position: { x: 5, y: 5 },
    value: name,
    origin: [0, 0],
    fontSize: 18,
  });

  const body = new Rectangle(this, {
    position: { x: 0, y: 0 },
    size: { x: textName.width + 10, y: textName.height + 10 },
    background: 0x3c1559,
    origin: [0, 0],
  });

  const textDescription = new Text(this, {
    position: { x: body.width + 10, y: 7 },
    value: `-  ${description}`,
    origin: [0, 0],
    fontSize: 14,
  });

  container.add([body, textName, textDescription]);
  container.setSize(body.width + 10 + textDescription.width, body.height);

  return container;
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
    { name: 'ESC', description: 'Pause game' },
  ]) {
    const keyItem = KeyItem.call(this, { x: 0, y: shift }, item.name, item.description);
    container.add(keyItem);
    shift += keyItem.height + 15;
  }

  return container
    .setName('ComponentControls');
};

export default Component;

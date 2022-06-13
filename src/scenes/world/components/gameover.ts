import Phaser from 'phaser';
import Text from '~ui/text';
import Rectangle from '~ui/rectangle';

import { UIComponent } from '~type/interface';
import { INTERFACE_MONOSPACE_FONT } from '~const/interface';

type Props = {
  data: string[]
};

const CONTAINER_SIZE = 440;
const CONTAINER_PADDING = 40;

const Component: UIComponent<Props> = function ComponentGaveOver(
  this: Phaser.Scene,
  { data },
) {
  const container = this.add.container(0, 0);

  const body = new Rectangle(this, {
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    origin: [0, 0],
    alpha: 0.7,
  });

  let shift = CONTAINER_PADDING;

  const title = new Text(this, {
    position: { x: CONTAINER_PADDING - 2, y: shift },
    value: 'GAME OVER',
    origin: [0, 0],
    color: '#f23a3a',
    fontSize: 50,
    shadow: 6,
  });
  shift += title.height + CONTAINER_PADDING * 0.75;

  const line = this.add.rectangle(
    CONTAINER_SIZE / 2,
    shift,
    CONTAINER_SIZE,
    2,
    0x000000,
  );
  shift += CONTAINER_PADDING;

  const text = new Text(this, {
    position: { x: CONTAINER_PADDING, y: shift },
    value: data,
    origin: [0, 0],
    fontSize: 16,
    fontFamily: INTERFACE_MONOSPACE_FONT,
    space: 10,
  });
  shift += text.height + CONTAINER_PADDING;

  container.add([body, title, line, text]);

  body.setSize(CONTAINER_SIZE, shift);
  container.setSize(CONTAINER_SIZE, shift);
  container.setPosition(
    this.sys.game.canvas.width / 2 - CONTAINER_SIZE / 2,
    this.sys.game.canvas.height / 2 - shift / 2,
  );

  return container
    .setName('ComponentGaveOver');
};

export default Component;

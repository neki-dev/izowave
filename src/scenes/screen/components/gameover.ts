import Component from '~lib/ui';

import { INTERFACE_MONOSPACE_FONT, INTERFACE_PIXEL_FONT } from '~const/interface';

type Props = {
  data: string[]
};

const CONTAINER_SIZE = 440;
const CONTAINER_PADDING = 40;

export default Component(function ComponentGameOver(container, { data }: Props) {
  const body = this.add.rectangle(0, 0, 0, 0, 0x000000, 0.75);
  body.setOrigin(0, 0);

  let shift = CONTAINER_PADDING;

  const title = this.add.text(CONTAINER_PADDING - 2, shift, 'GAME OVER', {
    color: '#f23a3a',
    fontSize: '50px',
    fontFamily: INTERFACE_PIXEL_FONT,
  });
  shift += title.height + CONTAINER_PADDING;

  const line = this.add.rectangle(CONTAINER_SIZE / 2, shift, CONTAINER_SIZE, 2, 0x000000);
  shift += CONTAINER_PADDING;

  const text = this.add.text(CONTAINER_PADDING, shift, data, {
    fontSize: '16px',
    fontFamily: INTERFACE_MONOSPACE_FONT,
    // @ts-ignore
    lineSpacing: 6,
  });
  shift += text.height + CONTAINER_PADDING;

  body.setSize(CONTAINER_SIZE, shift);

  container.add([body, title, line, text]);
  container.setPosition(container.x - CONTAINER_SIZE / 2, container.y - shift / 2);
  container.setSize(CONTAINER_SIZE, shift);
});

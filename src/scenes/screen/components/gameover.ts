import Component from '~lib/ui';

import { INTERFACE_MONOSPACE_FONT, INTERFACE_PIXEL_FONT } from '~const/interface';

type Props = {
  data: string[]
};

const CONTAINER_SIZE = 400;

export default Component(function ComponentGameOver(container, { data }: Props) {
  const title = this.add.text(CONTAINER_SIZE / 2, 0, 'GAME OVER', {
    color: '#f23a3a',
    fontSize: '100px',
    fontFamily: INTERFACE_PIXEL_FONT,
    padding: { bottom: 8 },
    shadow: {
      offsetX: 8,
      offsetY: 8,
      color: '#000000',
      blur: 0,
      fill: true,
    },
  });
  title.setOrigin(0.5, 0.0);

  const shift = title.height + 80;

  const text = this.add.text(0, shift, data, {
    fixedWidth: CONTAINER_SIZE,
    fontSize: '14px',
    fontFamily: INTERFACE_MONOSPACE_FONT,
    // @ts-ignore
    lineSpacing: 8,
    padding: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    },
  });

  const body = this.add.rectangle(0, shift, text.width, text.height, 0x000000, 0.5);
  body.setOrigin(0.0, 0.0);

  container.add([body, title, text]);
  container.setSize(body.width, shift + body.height);
  container.setPosition(container.x - container.width / 2, container.y - container.height / 2);
});

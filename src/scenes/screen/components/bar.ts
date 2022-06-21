import Component from '~lib/ui';
import ComponentAdditions from '~scene/screen/components/additions';

import { INTERFACE_FONT_PIXEL } from '~const/interface';

type Props = {
  display: () => string
  value: () => number
  maxValue: () => number
  event: (callback: (amount: number) => void) => void
  color: number
};

const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 30;

export default Component(function ComponentBar(container, {
  display, value, maxValue, event, color,
}: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x000000, 0.75);
  body.setOrigin(0.0, 0.0);

  const progress = this.add.rectangle(2, 2, 0, body.height - 4, color);
  progress.setOrigin(0.0, 0.0);

  const label = this.add.text(CONTAINER_WIDTH / 2, CONTAINER_HEIGHT / 2, display(), {
    fontSize: '11px',
    fontFamily: INTERFACE_FONT_PIXEL,
  });
  label.setOrigin(0.5, 0.5);

  const additions = ComponentAdditions.call(this, {
    x: CONTAINER_WIDTH + 10,
    y: CONTAINER_HEIGHT / 2,
  }, { event });

  container.add([body, progress, label, additions]);
  container.setSize(body.width, body.height);

  return {
    update: () => {
      const percent = value() / maxValue();
      progress.width = (body.width - 4) * percent;
      label.setText(display());
    },
  };
});

import World from '~scene/world';
import Live from '~scene/world/entities/live';
import Rectangle from '~ui/rectangle';

import { UIComponent } from '~type/interface';

type Props = {
  size: [number, number]
  live: Live
};

const Component: UIComponent<Props> = function ComponentHealthBar(
  this: World,
  { size, live }: Props,
) {
  const [width, height] = size;

  const body = this.add.rectangle(0, 0, width, height, 0x000000)
    .setOrigin(0, 0);

  const progress = new Rectangle(this, {
    position: { x: 1, y: 1 },
    size: { x: 0, y: 0 },
    origin: [0, 0],
    background: 0xe4372c,
    update: (self) => {
      const value = live.health / live.maxHealth;
      self.setSize((width - 2) * value, height - 2);
    },
  });

  const container = this.add.container(-width / 2, -height / 2);
  container.setSize(body.width, body.height);
  container.add([body, progress]);

  return container
    .setName('ComponentHealthBar');
};

export default Component;

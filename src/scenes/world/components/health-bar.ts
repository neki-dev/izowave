import World from '~scene/world';
import Live from '~scene/world/entities/live';

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
  let value = 0;

  const body = this.add.rectangle(0, 0, width, height, 0x000000);
  body.setOrigin(0, 0);

  const progress = this.add.rectangle(1, 1, 0, 0, 0xe4372c);
  progress.setOrigin(0, 0);

  const container = this.add.container(-width / 2, -height / 2);
  container.setSize(body.width, body.height);
  container.add([body, progress]);

  const update = () => {
    const newValue = live.health / live.maxHealth;
    if (newValue !== value) {
      value = newValue;
      progress.setSize((width - 2) * value, height - 2);
    }
  };
  this.events.on(Phaser.Scenes.Events.UPDATE, update, this);
  container.on(Phaser.Scenes.Events.DESTROY, () => {
    this.events.off(Phaser.Scenes.Events.UPDATE, update);
  });
  update();

  return container
    .setName('ComponentHealthBar');
};

export default Component;

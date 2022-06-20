import Component from '~lib/ui';
import Player from '~scene/world/entities/player';

import { INTERFACE_FONT_PIXEL } from '~const/interface';

type Props = {
  player: Player
};

const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 30;

export default Component(function ComponentHealth(container, { player }: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x000000, 0.75);
  body.setOrigin(0, 0);

  const progress = this.add.rectangle(2, 2, 0, body.height - 4, 0xe4372c);
  progress.setOrigin(0, 0);

  const health = this.add.text(CONTAINER_WIDTH / 2, CONTAINER_HEIGHT / 2, 'HP', {
    fontSize: '11px',
    fontFamily: INTERFACE_FONT_PIXEL,
  });
  health.setOrigin(0.5, 0.5);

  container.add([body, progress, health]);
  container.setSize(body.width, body.height);

  return {
    update: () => {
      const value = player.live.health / player.live.maxHealth;
      progress.width = (body.width - 4) * value;
      health.setText(`${String(player.live.health)}  HP`);
    },
  };
});

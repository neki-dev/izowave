import Component from '~lib/ui';
import Player from '~scene/world/entities/player';
import { calcGrowth } from '~lib/utils';

import { EXPERIENCE_TO_NEXT_LEVEL, EXPERIENCE_TO_NEXT_LEVEL_GROWTH } from '~const/difficulty';
import { INTERFACE_FONT_PIXEL } from '~const/interface';

type Props = {
  player: Player
};

const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 30;

export default Component(function ComponentExperience(container, { player }: Props) {
  const body = this.add.rectangle(0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, 0x000000, 0.75);
  body.setOrigin(0, 0);

  // const progressBody = this.add.rectangle(0, body.height - 1, body.width, 4, 0x555555);
  // progressBody.setOrigin(0, 0);

  const progress = this.add.rectangle(2, 2, 0, body.height - 4, 0x1975c5);
  progress.setOrigin(0, 0);

  const level = this.add.text(CONTAINER_WIDTH / 2, CONTAINER_HEIGHT / 2, 'LVL', {
    fontSize: '11px',
    fontFamily: INTERFACE_FONT_PIXEL,
  });
  level.setOrigin(0.5, 0.5);

  container.add([body, progress, level]);
  container.setSize(body.width, body.height);

  return {
    update: () => {
      const value = player.experience / calcGrowth(
        EXPERIENCE_TO_NEXT_LEVEL,
        EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
        player.level + 1,
      );
      progress.width = (body.width - 4) * value;
      level.setText(`${String(player.level)}  LVL`);
    },
  };
});

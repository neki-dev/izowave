import Component from '~lib/ui';
import Player from '~scene/world/entities/player';
import { calcGrowth } from '~lib/utils';

import { EXPERIENCE_TO_NEXT_LEVEL, EXPERIENCE_TO_NEXT_LEVEL_GROWTH } from '~const/difficulty';
import { INTERFACE_PIXEL_FONT } from '~const/interface';

type Props = {
  player: Player
};

export default Component(function ComponentExperience(container, { player }: Props) {
  const body = this.add.rectangle(0, 0, 100, 36, 0x000000);
  body.setOrigin(0, 0);

  const progressBody = this.add.rectangle(0, body.height - 1, body.width, 4, 0x555555);
  progressBody.setOrigin(0, 0);

  const progress = this.add.rectangle(0, body.height - 1, 0, 0, 0xa66cc0);
  progress.setOrigin(0, 0);

  const level = this.add.text(50, 18, 'LVL', {
    fontSize: '14px',
    fontFamily: INTERFACE_PIXEL_FONT,
  });
  level.setOrigin(0.5, 0.5);

  container.add([body, progressBody, progress, level]);
  container.setSize(body.width, body.height);

  return {
    update: () => {
      const value = player.experience / calcGrowth(
        EXPERIENCE_TO_NEXT_LEVEL,
        EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
        player.level + 1,
      );
      progress.setSize(body.width * value, 4);
      level.setText(`${String(player.level)}  LVL`);
    },
  };
});

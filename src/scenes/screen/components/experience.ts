import Phaser from 'phaser';
import Text from '~ui/text';
import Player from '~scene/world/entities/player';
import { calcGrowth } from '~lib/utils';

import { UIComponent } from '~type/interface';

import { EXPERIENCE_TO_NEXT_LEVEL, EXPERIENCE_TO_NEXT_LEVEL_GROWTH } from '~const/difficulty';

type Props = {
  player: Player
  x: number
  y: number
};

const Component: UIComponent<Props> = function ComponentExperience(
  this: Phaser.Scene,
  { player, x, y },
) {
  const container = this.add.container(x, y);

  const body = this.add.rectangle(0, 0, 100, 36, 0x000000);
  body.setOrigin(0, 0);
  container.setSize(body.width, body.height);

  const progressBody = this.add.rectangle(0, body.height - 2, body.width, 4, 0x555555);
  progressBody.setOrigin(0, 0);
  const progress = this.add.rectangle(0, body.height - 2, 0, 0, 0xa66cc0);
  progress.setOrigin(0, 0);

  const level = new Text(this, {
    position: {
      x: 50,
      y: 18,
    },
    update: (self) => {
      const value = player.experience / calcGrowth(
        EXPERIENCE_TO_NEXT_LEVEL,
        EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
        player.level + 1,
      );
      progress.setSize(body.width * value, 4);
      self.setText(`${String(player.level)}  LVL`);
    },
    fontSize: 14,
    origin: [0.5, 0.5],
  });

  container.add([body, progressBody, progress, level]);

  return container
    .setName('ComponentExperience');
};

export default Component;

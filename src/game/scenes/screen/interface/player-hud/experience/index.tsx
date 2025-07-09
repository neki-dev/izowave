import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~game/types';
import { Amount } from '~scene/system/interface/amount';
import { PlayerEvent } from '~scene/world/entities/player/types';
import type { WorldScene } from '~scene/world';

export const Experience: React.FC = () => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.experience);

  useEvent(world.player, PlayerEvent.UPDATE_EXPERIENCE, (experience: number) => {
    setAmount(experience);
  }, []);

  return (
    <Amount type="EXPERIENCE" placeholder={true}>
      {amount}
    </Amount>
  );
};

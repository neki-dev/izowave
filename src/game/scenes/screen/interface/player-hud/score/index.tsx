import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~game/types';
import { Amount } from '~scene/system/interface/amount';
import { PlayerEvent } from '~scene/world/entities/player/types';
import type { IWorld } from '~scene/world/types';

export const Score: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.score);

  useEvent(world.player, PlayerEvent.UPDATE_SCORE, (score: number) => {
    setAmount(score);
  }, []);

  return (
    <Amount type="SCORE" placeholder={true}>
      {amount}
    </Amount>
  );
};

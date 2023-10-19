import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { Amount } from '~scene/system/interface/amount';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents } from '~type/world/entities/player';

export const Score: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.score);

  useEvent(world.player, PlayerEvents.UPDATE_SCORE, (score: number) => {
    setAmount(score);
  }, []);

  return <Amount type="SCORE" placeholder={true}>{amount}</Amount>;
};

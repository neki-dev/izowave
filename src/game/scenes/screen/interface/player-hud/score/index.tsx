import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { Amount } from '~scene/system/interface/amount';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';

export const Score: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(0);

  useSceneUpdate(world, () => {
    setAmount(world.player.score);
  }, []);

  return <Amount type="SCORE">{amount}</Amount>;
};

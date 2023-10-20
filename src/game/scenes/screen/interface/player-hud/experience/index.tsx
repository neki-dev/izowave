import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { Amount } from '~scene/system/interface/amount';
import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents } from '~type/world/entities/player';

export const Experience: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.experience);

  useEvent(world.player, PlayerEvents.UPDATE_EXPERIENCE, (experience: number) => {
    setAmount(experience);
  }, []);

  return <Amount type="EXPERIENCE" placeholder={true}>{amount}</Amount>;
};

import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '../../../../../types';
import { Amount } from '~scene/system/interface/amount';
import { PlayerEvents } from '~scene/world/entities/player/types';
import type { IWorld } from '~scene/world/types';

export const Experience: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.experience);

  useEvent(world.player, PlayerEvents.UPDATE_EXPERIENCE, (experience: number) => {
    setAmount(experience);
  }, []);

  return <Amount type="EXPERIENCE" placeholder={true}>{amount}</Amount>;
};

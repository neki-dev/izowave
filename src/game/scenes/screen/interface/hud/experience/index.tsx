import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';

import { ComponentWidget } from '../widget';

export const ComponentExperience: React.FC = () => {
  const game = useContext(GameContext);

  const [amount, setAmount] = useState(0);

  useWorldUpdate(() => {
    setAmount(game.world.player.experience);
  });

  return (
    <ComponentWidget label="EXPERIENCE" icon="experience">
      {amount}
    </ComponentWidget>
  );
};

ComponentExperience.displayName = 'ComponentExperience';

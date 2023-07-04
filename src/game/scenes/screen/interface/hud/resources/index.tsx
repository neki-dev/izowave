import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';

import { ComponentWidget } from '../widget';

export const ComponentResources: React.FC = () => {
  const game = useContext(GameContext);

  const [amount, setAmount] = useState(0);

  useWorldUpdate(() => {
    setAmount(game.world.player.resources);
  });

  return <ComponentWidget icon="resources">{amount}</ComponentWidget>;
};

ComponentResources.displayName = 'ComponentResources';

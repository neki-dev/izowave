import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';

import { Icon, State, Wrapper } from './styles';

export const ComponentResources: React.FC = () => {
  const game = useContext(GameContext);

  const [amount, setAmount] = useState(0);

  useWorldUpdate(() => {
    setAmount(game.world.player.resources);
  });

  return (
    <Wrapper>
      <Icon src={'assets/sprites/icons/resources.png'} />
      <State>
        <State.Label>RESOURCES</State.Label>
        <State.Amount>{amount}</State.Amount>
      </State>
    </Wrapper>
  );
};

ComponentResources.displayName = 'ComponentResources';

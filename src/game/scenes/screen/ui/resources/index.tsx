import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/ui';
import { ScreenTexture } from '~type/screen';

import { Icon, State, Wrapper } from './styles';

export const ComponentResources: React.FC = () => {
  const game = useContext(GameContext);

  const [amount, setAmount] = useState(game.world.player.resources);

  useWorldUpdate(() => {
    setAmount(game.world.player.resources);
  });

  return (
    <Wrapper>
      <Icon src={`assets/sprites/${ScreenTexture.RESOURCES}.png`} />
      <State>
        <State.Label>RESOURCES</State.Label>
        <State.Amount>{amount}</State.Amount>
      </State>
    </Wrapper>
  );
};

ComponentResources.displayName = 'ComponentResources';

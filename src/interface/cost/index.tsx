import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';

import { Cost } from './styles';

type Props = {
  view?: 'large' | 'small'
  label?: string
  amount: number
};

export const ComponentCost: React.FC<Props> = ({
  label,
  amount,
  view = 'large',
}) => {
  const game = useContext(GameContext);

  const [playerResources, setPlayerResources] = useState(0);

  useWorldUpdate(() => {
    setPlayerResources(game.world.player.resources);
  });

  return (
    <Cost className={view}>
      {label && <Cost.Label>{label}</Cost.Label>}
      <Cost.Icon src={'assets/sprites/icons/resources.png'} />
      <Cost.Value
        className={cn({
          attention: playerResources < amount,
        })}
      >
        {amount}
      </Cost.Value>
    </Cost>
  );
};

ComponentCost.displayName = 'ComponentCost';

import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';

import {
  Wrapper, Label, Icon, Value,
} from './styles';

type Props = {
  type: 'resources' | 'experience'
  view?: 'large' | 'small'
  label?: string
  value: number
};

export const ComponentAmount: React.FC<Props> = ({
  type,
  label,
  value,
  view = 'large',
}) => {
  const game = useContext(GameContext);

  const [haveAmount, setHaveAmount] = useState(0);

  useWorldUpdate(() => {
    setHaveAmount(game.world.player[type]);
  });

  return (
    <Wrapper className={view}>
      {label && <Label>{label}</Label>}
      <Icon src={`assets/sprites/icons/${type}.png`} />
      <Value
        className={cn({
          attention: haveAmount < value,
        })}
      >
        {value}
      </Value>
    </Wrapper>
  );
};

ComponentAmount.displayName = 'ComponentAmount';

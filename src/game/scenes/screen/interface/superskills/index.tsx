import React, { useMemo } from 'react';

import { PlayerSuperskill } from '~type/world/entities/player';

import { Item } from './item';
import { Wrapper } from './styles';

export const Superskills: React.FC = () => {
  const superskills = useMemo(() => (
    Object.keys(PlayerSuperskill) as PlayerSuperskill[]
  ), []);

  return (
    <Wrapper>
      {superskills.map((superskill) => (
        <Item key={superskill} type={superskill} />
      ))}
    </Wrapper>
  );
};

import React from 'react';

import { BuildingControl } from '~type/world/entities/building';

import { Action } from './action';
import { Wrapper } from './styles';

type Props = {
  list: BuildingControl[]
};

export const Controls: React.FC<Props> = ({ list }) => (
  <Wrapper>
    {list.map((control) => (
      <Action key={control.label} control={control} />
    ))}
  </Wrapper>
);

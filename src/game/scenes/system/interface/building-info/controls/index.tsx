import React from 'react';

import { Action } from './action';

import type { BuildingControl } from '~scene/world/entities/building/types';

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

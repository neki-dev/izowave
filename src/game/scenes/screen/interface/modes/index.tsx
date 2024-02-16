import React from 'react';

import { Item } from './item';
import { Wrapper } from './styles';
import { Utils } from '~lib/utils';
import { WorldMode } from '~scene/world/types';

export const Modes: React.FC = () => (
  <Wrapper>
    {Utils.MapObject(WorldMode, (key, mode) => (
      <Item key={key} mode={mode} />
    ))}
  </Wrapper>
);

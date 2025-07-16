import React from 'react';

import { Item } from './item';

import { Utils } from '~core/utils';
import { WorldMode } from '~scene/world/types';

import { Wrapper } from './styles';

export const Modes: React.FC = () => (
  <Wrapper>
    {Utils.MapObject(WorldMode, (key, mode) => (
      <Item key={key} mode={mode} />
    ))}
  </Wrapper>
);

import React from 'react';

import { Param } from './param';

import { GameSettings } from '~game/types';

import { Wrapper } from './styles';

export const Settings: React.FC = () => (
  <Wrapper>
    {Object.values(GameSettings).map((type) => (
      <Param key={type} type={type} />
    ))}
  </Wrapper>
);

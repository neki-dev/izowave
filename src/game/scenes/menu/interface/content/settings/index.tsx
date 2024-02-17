import React from 'react';

import { GameSettings } from '../../../../../types';

import { Param } from './param';

import { Wrapper } from './styles';

export const Settings: React.FC = () => (
  <Wrapper>
    {Object.values(GameSettings).map((type) => (
      <Param key={type} type={type} />
    ))}
  </Wrapper>
);

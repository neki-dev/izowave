import React from 'react';

import { phrase } from '~core/lang';

import { Wrapper } from './styles';

export const AboutGame: React.FC = () => (
  <Wrapper>
    {phrase('GAME_DESCRIPTION')}
  </Wrapper>
);

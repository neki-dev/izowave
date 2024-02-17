import React from 'react';

import { phrase } from '~lib/lang';

import { Wrapper } from './styles';

export const AboutGame: React.FC = () => (
  <Wrapper>
    {phrase('GAME_DESCRIPTION')}
  </Wrapper>
);

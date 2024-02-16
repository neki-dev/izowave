import React from 'react';

import { Wrapper } from './styles';
import { phrase } from '~lib/lang';

export const AboutGame: React.FC = () => (
  <Wrapper>
    {phrase('GAME_DESCRIPTION')}
  </Wrapper>
);

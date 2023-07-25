import React from 'react';

import {
  Icon, IconContainer, Value, Wrapper,
} from './styles';

type Props = {
  children: React.ReactNode
  type: 'resources' | 'experience'
};

export const Amount: React.FC<Props> = ({ children, type }) => (
  <Wrapper>
    <IconContainer>
      <Icon src={`assets/sprites/hud/${type}.png`} />
    </IconContainer>
    <Value>
      {children}
    </Value>
  </Wrapper>
);

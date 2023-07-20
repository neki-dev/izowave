import React from 'react';

import {
  Icon, IconContainer, Value, Wrapper,
} from './styles';

type Props = {
  children: string | number
  icon: string
};

export const Amount: React.FC<Props> = ({ children, icon }) => (
  <Wrapper>
    <IconContainer>
      <Icon src={`assets/sprites/interface/hud/${icon}.png`} />
    </IconContainer>
    <Value>
      {children}
    </Value>
  </Wrapper>
);

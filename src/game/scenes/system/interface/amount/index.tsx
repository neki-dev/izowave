import React from 'react';

import {
  Icon, IconContainer, Value, Wrapper, Placeholder,
} from './styles';

type Props = {
  children: React.ReactNode
  type: 'resources' | 'experience' | 'score'
};

export const Amount: React.FC<Props> = ({ children, type }) => (
  <Wrapper>
    <IconContainer>
      <Icon src={`assets/sprites/hud/${type}.png`} />
    </IconContainer>
    <Value>{children}</Value>
    <Placeholder>{type}</Placeholder>
  </Wrapper>
);

import React from 'react';

import { phrase } from '~lib/lang';

import {
  Icon, IconContainer, Value, Wrapper, Container, Placeholder,
} from './styles';

type Props = {
  children: React.ReactNode
  type: 'RESOURCES' | 'EXPERIENCE' | 'SCORE'
  placeholder?: boolean
};

export const Amount: React.FC<Props> = ({ children, type, placeholder }) => (
  <Wrapper>
    <Container>
      <IconContainer>
        <Icon src={`assets/sprites/hud/${type.toLowerCase()}.png`} />
      </IconContainer>
      <Value>{children}</Value>
    </Container>
    {placeholder && (
      <Placeholder>{phrase(type)}</Placeholder>
    )}
  </Wrapper>
);

import React from 'react';

import { phrase } from '~lib/lang';

import {
  Icon, IconContainer, Value, Wrapper, Placeholder,
} from './styles';

type Props = {
  children: React.ReactNode
  type: 'RESOURCES' | 'EXPERIENCE' | 'SCORE'
  hint?: boolean
};

export const Amount: React.FC<Props> = ({ children, type, hint }) => (
  <Wrapper>
    <IconContainer>
      <Icon src={`assets/sprites/hud/${type.toLowerCase()}.png`} />
    </IconContainer>
    <Value>{children}</Value>
    {hint && (
      <Placeholder>{phrase(type)}</Placeholder>
    )}
  </Wrapper>
);

import React from 'react';

import { Positioner, Wrapper, Container } from './styles';

type Props = {
  side: 'left' | 'right' | 'top' | 'bottom'
  children: string
};

export const ComponentHint: React.FC<Props> = ({ children, side }) => (
  <Wrapper role="hint">
    <Positioner className={side}>
      <Container>{children}</Container>
    </Positioner>
  </Wrapper>
);

ComponentHint.displayName = 'ComponentHint';

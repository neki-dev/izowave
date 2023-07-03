import cn from 'classnames';
import React from 'react';

import { Positioner, Wrapper, Container } from './styles';

type Props = {
  side: 'left' | 'right' | 'top' | 'bottom'
  align?: 'left' | 'center' | 'right'
  children: string
};

export const ComponentHint: React.FC<Props> = ({
  children,
  side,
  align = 'center',
}) => (
  <Wrapper role="hint">
    <Positioner className={cn(`side-${side}`, `align-${align}`)}>
      <Container>{children}</Container>
    </Positioner>
  </Wrapper>
);

ComponentHint.displayName = 'ComponentHint';

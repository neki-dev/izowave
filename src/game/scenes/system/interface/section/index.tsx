import React from 'react';

import { Wrapper } from './styles';

type Props = {
  direction: 'vertical' | 'horizontal'
  gap?: number
  children: React.ReactNode
};

export const Section: React.FC<Props> = ({ children, direction, gap = 0 }) => (
  <Wrapper $direction={direction} $gap={gap}>
    {children}
  </Wrapper>
);

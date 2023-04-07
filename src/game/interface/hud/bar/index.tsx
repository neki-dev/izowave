import React from 'react';

import { Wrapper, Progress, Value } from './styles';

type Props = {
  percent: number
  color: string
  children: string
};

export const ComponentBar: React.FC<Props> = ({ percent, color, children }) => (
    <Wrapper>
      <Progress style={{ width: `${percent * 100}%`, background: color }} />
      <Value>{children}</Value>
    </Wrapper>
);

ComponentBar.displayName = 'ComponentBar';

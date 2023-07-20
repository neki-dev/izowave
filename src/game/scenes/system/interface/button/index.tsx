import React from 'react';

import { Container } from './styles';

type Props = {
  size: 'small' | 'large'
  active?: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
  children: React.ReactNode
};

export const Button: React.FC<Props> = ({
  size, active, onClick, children,
}) => (
  <Container onClick={onClick} $size={size} $active={active}>
    {children}
  </Container>
);

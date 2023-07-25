import React from 'react';

import { Container } from './styles';

type Props = {
  size?: 'small' | 'large'
  view?: 'active' | 'confirm' | 'decline'
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
  children: React.ReactNode
};

export const Button: React.FC<Props> = ({
  size, view, onClick, children,
}) => (
  <Container onClick={onClick} $size={size} $view={view}>
    {children}
  </Container>
);

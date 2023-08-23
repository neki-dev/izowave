import React from 'react';

import { Container } from './styles';

type Props = {
  size?: 'fixed' | 'small' | 'medium' | 'large'
  view?: 'active' | 'primary' | 'confirm' | 'decline'
  disabled?: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
  children: React.ReactNode
};

export const Button: React.FC<Props> = ({
  size, view, disabled, onClick, children,
}) => (
  <Container onClick={onClick} $size={size} $view={view} $disabled={disabled}>
    {children}
  </Container>
);

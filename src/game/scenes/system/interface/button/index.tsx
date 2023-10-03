import { useMobilePlatform } from 'phaser-react-ui';
import React from 'react';

import { Container } from './styles';

type Props = {
  size?: 'small' | 'medium' | 'large'
  view?: 'active' | 'primary' | 'confirm' | 'decline'
  disabled?: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
  children: React.ReactNode
};

export const Button: React.FC<Props> = ({
  size,
  view,
  disabled,
  onClick,
  children,
}) => {
  const isMobile = useMobilePlatform();

  return (
    <Container
      $size={size}
      $view={view}
      $disabled={disabled}
      {...{
        [isMobile ? 'onTouchEnd' : 'onClick']: onClick,
      }}
    >
      {children}
    </Container>
  );
};

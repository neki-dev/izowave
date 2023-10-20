import { useClick } from 'phaser-react-ui';
import React, { useRef } from 'react';

import { Container } from './styles';

type Props = {
  size?: 'small' | 'large'
  view?: 'primary' | 'confirm' | 'decline'
  disabled?: boolean
  onClick: (event: MouseEvent | TouchEvent) => void
  children: React.ReactNode
};

export const Button: React.FC<Props> = ({
  size,
  view,
  disabled,
  onClick,
  children,
}) => {
  const refContainer = useRef<HTMLDivElement>(null);

  useClick(refContainer, 'down', onClick, [onClick]);

  return (
    <Container
      ref={refContainer}
      $size={size}
      $view={view}
      $disabled={disabled}
      role='button'
    >
      {children}
    </Container>
  );
};

import React from 'react';

import { phrase } from '~lib/lang';

import { Container, Content, Buttons } from './styles';
import { Button } from '../button';

type Props = {
  children: React.ReactNode
  onConfirm: () => void
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ children, onConfirm, onClose }) => (
  <Container>
    <Content>{children}</Content>
    <Buttons>
      <Button view="confirm" size="small" onClick={onConfirm}>
        {phrase('YES')}
      </Button>
      <Button view="decline" size="small" onClick={onClose}>
        {phrase('NO')}
      </Button>
    </Buttons>
  </Container>
);

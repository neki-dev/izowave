import React from 'react';

import { phrase } from '~lib/lang';
import { LangPhrase } from '~type/lang';

import {
  Overlay, Container, Content, Buttons,
} from './styles';
import { Button } from '../button';

type Props = {
  message: LangPhrase
  onConfirm: () => void
  onClose: () => void
};

export const Confirm: React.FC<Props> = ({ message, onConfirm, onClose }) => (
  <Overlay>
    <Container>
      <Content>{phrase(message)}</Content>
      <Buttons>
        <Button view="confirm" size="small" onClick={onConfirm}>
          {phrase('YES')}
        </Button>
        <Button view="decline" size="small" onClick={onClose}>
          {phrase('NO')}
        </Button>
      </Buttons>
    </Container>
  </Overlay>
);

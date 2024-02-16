import { useCurrentScene, useEvent } from 'phaser-react-ui';
import React from 'react';

import { Button } from '../button';
import {
  Overlay, Container, Content, Buttons,
} from './styles';
import type { LangPhrase } from '~lib/lang/types';
import { phrase } from '~lib/lang';

type Props = {
  message: LangPhrase
  onConfirm: () => void
  onClose: () => void
};

export const Confirm: React.FC<Props> = ({ message, onConfirm, onClose }) => {
  const scene = useCurrentScene();

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  useEvent(scene.input.keyboard, 'keyup-ENTER', handleConfirm, [handleConfirm]);

  return (
    <Overlay>
      <Container>
        <Content>{phrase(message)}</Content>
        <Buttons>
          <Button view="confirm" size="small" onClick={handleConfirm}>
            {phrase('YES')}
          </Button>
          <Button view="decline" size="small" onClick={onClose}>
            {phrase('NO')}
          </Button>
        </Buttons>
      </Container>
    </Overlay>
  );
};

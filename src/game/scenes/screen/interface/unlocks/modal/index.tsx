import { useClick, useCurrentScene, useEvent } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import type { Feature } from '..';

import { Item } from './item';

import { phrase } from '~core/lang';
import { Tutorial } from '~core/tutorial';

import { Button, Container, Label, List, Overlay } from './styles';

type Props = {
  features: Feature[]
  onClose: () => void
};

export const Modal: React.FC<Props> = ({ features, onClose }) => {
  const scene = useCurrentScene();

  const [unlocks, setUnlocks] = useState(features);

  const refOverlay = useRef<HTMLDivElement>(null);
  const refButton = useRef<HTMLDivElement>(null);

  useClick(refOverlay, 'down', () => {}, []);
  useClick(refButton, 'down', onClose, []);

  useEvent(scene.input.keyboard, 'keyup-ESC', onClose, []);

  useEffect(() => {
    setUnlocks(features);
  }, [features]);

  useEffect(() => {
    Tutorial.ToggleHintsVisible(false);

    return () => {
      Tutorial.ToggleHintsVisible(true);
    };
  }, []);

  return (
    <Overlay ref={refOverlay}>
      <Container>
        <Label>{phrase('FEATURES_UNLOCKED')}</Label>
        <List>
          {unlocks.map((feature, i) => (
            <Item key={i} {...feature} />
          ))}
        </List>
        <Button ref={refButton}>{phrase('CONTINUE_GAME')}</Button>
      </Container>
    </Overlay>
  );
};

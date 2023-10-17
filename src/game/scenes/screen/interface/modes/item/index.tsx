import { useClick, useScene } from 'phaser-react-ui';
import React, { useRef, useState } from 'react';

import { phrase } from '~lib/lang';
import { GameScene } from '~type/game';
import { IWorld, WorldMode } from '~type/world';

import { Container, Placeholder, Icon } from './styles';

type Props = {
  mode: WorldMode
};

export const Item: React.FC<Props> = ({ mode }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refContainer = useRef<HTMLDivElement>(null);

  const [isActive, setActive] = useState(() => (
    world.isModeActive(mode)
  ));

  useClick(refContainer, 'down', () => {
    world.setModeActive(mode, !isActive);
    setActive(!isActive);
  }, [isActive]);

  return (
    <Container ref={refContainer} $active={isActive}>
      <Icon src={`assets/sprites/modes/${mode.toLowerCase()}.png`} />
      <Placeholder>{phrase(mode)}</Placeholder>
    </Container>
  );
};

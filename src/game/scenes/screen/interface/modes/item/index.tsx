import { useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { phrase } from '~lib/lang';
import { GameScene } from '~type/game';
import { IWorld, WorldMode } from '~type/world';

import { Container, Placeholder, Icon } from './styles';

type Props = {
  mode: WorldMode
};

export const Item: React.FC<Props> = ({ mode }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isActive, setActive] = useState(() => (
    world.isModeActive(mode)
  ));

  const onClick = () => {
    world.setModeActive(mode, !isActive);
    setActive(!isActive);
  };

  return (
    <Container $active={isActive} onClick={onClick}>
      <Icon src={`assets/sprites/modes/${mode.toLowerCase()}.png`} />
      <Placeholder>{phrase(mode)}</Placeholder>
    </Container>
  );
};

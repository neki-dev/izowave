import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';

import { Container, Progress, Value } from './styles';

export const ComponentHealth: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [health, setHealth] = useState(0);
  const [maxHealth, setMaxHealth] = useState(0);

  useSceneUpdate(world, () => {
    setHealth(world.player.live.health);
    setMaxHealth(world.player.live.maxHealth);
  });

  return (
    <Container>
      <Progress style={{ width: `${(health / maxHealth) * 100}%` }} />
      <Value>{`${health} HP`}</Value>
    </Container>
  );
};

ComponentHealth.displayName = 'ComponentHealth';

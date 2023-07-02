import React, { useContext, useState } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';

import { Container, Progress, Value } from './styles';

export const ComponentHealth: React.FC = () => {
  const game = useContext(GameContext);

  const [health, setHealth] = useState(0);
  const [maxHealth, setMaxHealth] = useState(0);

  useWorldUpdate(() => {
    setHealth(game.world.player.live.health);
    setMaxHealth(game.world.player.live.maxHealth);
  });

  return (
    <Container>
      <Progress style={{ width: `${(health / maxHealth) * 100}%` }} />
      <Value>{`${health} HP`}</Value>
    </Container>
  );
};

ComponentHealth.displayName = 'ComponentHealth';

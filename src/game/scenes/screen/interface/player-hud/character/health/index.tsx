import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~game/types';
import type { WorldScene } from '~scene/world';
import { LiveEvent } from '~scene/world/entities/addons/live/types';

import { Container, Progress, Value } from './styles';

export const Health: React.FC = () => {
  const world = useScene<WorldScene>(GameScene.WORLD);

  const [health, setHealth] = useState(world.player.live.health);
  const [maxHealth, setMaxHealth] = useState(world.player.live.maxHealth);

  useEvent(world.player.live, LiveEvent.UPDATE_HEALTH, (amount: number) => {
    setHealth(amount);
  }, []);

  useEvent(world.player.live, LiveEvent.UPDATE_MAX_HEALTH, (amount: number) => {
    setMaxHealth(amount);
  }, []);

  return (
    <Container>
      <Progress style={{ width: `${(health / maxHealth) * 100}%` }} />
      <Value>{`${health} HP`}</Value>
    </Container>
  );
};

import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '../../../../../../types';
import { LiveEvents } from '~scene/world/entities/addons/live/types';
import { IWorld } from '~scene/world/types';

import { Container, Progress, Value } from './styles';

export const Health: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [health, setHealth] = useState(world.player.live.health);
  const [maxHealth, setMaxHealth] = useState(world.player.live.maxHealth);

  useEvent(world.player.live, LiveEvents.UPDATE_HEALTH, (amount: number) => {
    setHealth(amount);
  }, []);

  useEvent(world.player.live, LiveEvents.UPDATE_MAX_HEALTH, (amount: number) => {
    setMaxHealth(amount);
  }, []);

  return (
    <Container>
      <Progress style={{ width: `${(health / maxHealth) * 100}%` }} />
      <Value>{`${health} HP`}</Value>
    </Container>
  );
};

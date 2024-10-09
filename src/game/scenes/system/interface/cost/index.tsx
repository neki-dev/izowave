import { useEvent, useScene } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import type { IWorld } from '~scene/world/types';

import { GameScene } from '~game/types';
import { PlayerEvent } from '~scene/world/entities/player/types';

import { Wrapper, Icon, Value } from './styles';

type Props = {
  type: 'RESOURCES' | 'EXPERIENCE'
  check?: boolean
  value: number | string
};

export const Cost: React.FC<Props> = ({ type, value, check = true }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const refValue = useRef(value);

  const [haveAmount, setHaveAmount] = useState(() => {
    const field = type.toLowerCase() as 'resources' | 'experience';
    return world.player[field];
  });

  const enough = (!check || typeof value !== 'number' || haveAmount >= value);

  useEvent(world.player, PlayerEvent[`UPDATE_${type}`], (amount: number) => {
    setHaveAmount(amount);
  }, []);

  useEffect(() => {
    refValue.current = value;
  }, [value]);

  return (
    <Wrapper>
      <Icon src={`assets/sprites/hud/${type.toLowerCase()}.png`} />
      <Value $attention={!enough}>{value}</Value>
    </Wrapper>
  );
};

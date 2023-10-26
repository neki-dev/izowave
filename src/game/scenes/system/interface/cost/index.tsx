import { useEvent, useScene } from 'phaser-react-ui';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';
import { PlayerEvents } from '~type/world/entities/player';

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

  const isEnough = useMemo(() => (
    (!check || typeof value !== 'number' || haveAmount >= value)
  ), [check, value, haveAmount]);

  useEvent(world.player, PlayerEvents[`UPDATE_${type}`], (amount: number) => {
    setHaveAmount(amount);
  }, []);

  useEffect(() => {
    refValue.current = value;
  }, [value]);

  return (
    <Wrapper>
      <Icon src={`assets/sprites/hud/${type.toLowerCase()}.png`} />
      <Value $attention={!isEnough}>{value}</Value>
    </Wrapper>
  );
};

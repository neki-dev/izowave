import { useEvent, useScene } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

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

  const [isEnough, setEnough] = useState(() => {
    if (check && typeof refValue.current === 'number') {
      const field = type.toLowerCase() as 'resources' | 'experience';

      return world.player[field] >= refValue.current;
    }

    return true;
  });

  useEvent(world.player, PlayerEvents[`UPDATE_${type}`], (amount: number) => {
    if (check && typeof refValue.current === 'number') {
      setEnough(amount >= refValue.current);
    }
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

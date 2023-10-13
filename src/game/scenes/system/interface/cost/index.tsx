import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';

import { Wrapper, Icon, Value } from './styles';

type Props = {
  type: 'resources' | 'experience'
  check?: boolean
  value: number | string
};

export const Cost: React.FC<Props> = ({ type, value, check = true }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isNotEnough, setNotEnough] = useState(false);

  useSceneUpdate(world, () => {
    if (check && typeof value === 'number') {
      setNotEnough(world.player[type] < value);
    }
  }, [check, value]);

  return (
    <Wrapper>
      <Icon src={`assets/sprites/hud/${type}.png`} />
      <Value $attention={isNotEnough}>{value}</Value>
    </Wrapper>
  );
};

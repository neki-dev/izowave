import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';

import { Wrapper, Icon, Value } from './styles';

type Props = {
  type: 'resources' | 'experience'
  size: 'large' | 'small'
  value: number
};

export const Cost: React.FC<Props> = ({ type, value, size }) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [haveAmount, setHaveAmount] = useState(0);

  useSceneUpdate(world, () => {
    setHaveAmount(world.player[type]);
  }, []);

  return (
    <Wrapper $size={size}>
      <Icon src={`assets/sprites/hud/${type}.png`} />
      <Value $attention={haveAmount < value}>{value}</Value>
    </Wrapper>
  );
};

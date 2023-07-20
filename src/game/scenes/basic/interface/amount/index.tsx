import cn from 'classnames';
import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameScene } from '~type/game';
import { IWorld } from '~type/world';

import {
  Wrapper, Label, Icon, Value,
} from './styles';

type Props = {
  type: 'resources' | 'experience'
  view?: 'large' | 'small'
  label?: string
  value: number
};

export const Amount: React.FC<Props> = ({
  type,
  label,
  value,
  view = 'large',
}) => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [haveAmount, setHaveAmount] = useState(0);

  useSceneUpdate(world, () => {
    setHaveAmount(world.player[type]);
  });

  return (
    <Wrapper className={view}>
      {label && <Label>{label}</Label>}
      <Icon src={`assets/sprites/interface/${type}.png`} />
      <Value
        className={cn({
          attention: haveAmount < value,
        })}
      >
        {value}
      </Value>
    </Wrapper>
  );
};

import { useEvent, useScene } from 'phaser-react-ui';
import React, { useEffect, useRef, useState } from 'react';

import imageExperience from './images/experience.png';
import imageResources from './images/resources.png';

import { GameScene } from '~game/types';
import type { WorldScene } from '~scene/world';
import { PlayerEvent } from '~scene/world/entities/player/types';

import { Wrapper, Icon, Value } from './styles';

type Props = {
  type: 'RESOURCES' | 'EXPERIENCE'
  check?: boolean
  value: number | string
};

const IMAGES = {
  RESOURCES: imageResources,
  EXPERIENCE: imageExperience,
};

export const Cost: React.FC<Props> = ({ type, value, check = true }) => {
  const world = useScene<WorldScene>(GameScene.WORLD);

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
      <Icon src={IMAGES[type]} />
      <Value $attention={!enough}>{value}</Value>
    </Wrapper>
  );
};

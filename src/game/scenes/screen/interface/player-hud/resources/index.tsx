import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { GameScene } from '../../../../../types';
import { Tutorial } from '~lib/tutorial';
import { TutorialStep } from '~lib/tutorial/types';
import { Amount } from '~scene/system/interface/amount';
import { Hint } from '~scene/system/interface/hint';
import { PlayerEvents } from '~scene/world/entities/player/types';
import { IWorld } from '~scene/world/types';

import { Wrapper } from './styles';

export const Resources: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(world.player.resources);
  const [hint, setHint] = useState(false);

  useEffect(
    () => Tutorial.Bind(TutorialStep.RESOURCES, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  useEvent(world.player, PlayerEvents.UPDATE_RESOURCES, (resources: number) => {
    setAmount(resources);
  }, []);

  return (
    <Wrapper>
      <Amount type="RESOURCES" placeholder={true}>{amount}</Amount>
      {hint && (
        <Hint label='TUTORIAL_RESOURCES' side="top" align="left" />
      )}
    </Wrapper>
  );
};

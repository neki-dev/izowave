import { useEvent, useScene } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { Tutorial } from '~lib/tutorial';
import { Amount } from '~scene/system/interface/amount';
import { Hint } from '~scene/system/interface/hint';
import { GameScene } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';
import { PlayerEvents } from '~type/world/entities/player';

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

import { useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { Tutorial } from '~lib/tutorial';
import { Amount } from '~scene/system/interface/amount';
import { Hint } from '~scene/system/interface/hint';
import { GameScene } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';

import { Wrapper } from './styles';

export const Resources: React.FC = () => {
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(0);
  const [hint, setHint] = useState(false);

  useEffect(
    () => Tutorial.Bind(TutorialStep.RESOURCES, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  useSceneUpdate(world, () => {
    setAmount(world.player.resources);
  }, []);

  return (
    <Wrapper>
      <Amount type="RESOURCES">{amount}</Amount>
      {hint && (
        <Hint label='TUTORIAL_RESOURCES' side="top" align="left" />
      )}
    </Wrapper>
  );
};

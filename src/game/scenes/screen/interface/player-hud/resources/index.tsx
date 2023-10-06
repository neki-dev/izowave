import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { Amount } from '~scene/system/interface/amount';
import { Hint } from '~scene/system/interface/hint';
import { IGame, GameScene } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';

import { Wrapper } from './styles';

export const Resources: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [amount, setAmount] = useState(0);
  const [hint, setHint] = useState(false);

  useEffect(
    () => game.tutorial.bind(TutorialStep.RESOURCES, {
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
      <Amount type="resources">{amount}</Amount>
      {hint && (
        <Hint side="top" align="left">
          If resources not enough
          <br />
          you can find crystals on map
        </Hint>
      )}
    </Wrapper>
  );
};

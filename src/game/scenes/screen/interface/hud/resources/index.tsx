import { useGame, useScene, useSceneUpdate } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { ComponentHint } from '~scene/basic/interface/hint';
import { IGame, GameScene } from '~type/game';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';

import { Wrapper } from './styles';
import { ComponentWidget } from '../widget';

export const ComponentResources: React.FC = () => {
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
  });

  return (
    <Wrapper>
      <ComponentWidget icon="resources">{amount}</ComponentWidget>
      {hint && (
        <ComponentHint side="top" align="left">
          If resources not enough you can find crystals on map
        </ComponentHint>
      )}
    </Wrapper>
  );
};

ComponentResources.displayName = 'ComponentResources';

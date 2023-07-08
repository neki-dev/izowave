import React, { useContext, useState, useEffect } from 'react';

import { GameContext, useWorldUpdate } from '~lib/interface';
import { ComponentHint } from '~scene/basic/interface/hint';
import { TutorialStep } from '~type/tutorial';

import { ComponentWidget } from '../widget';
import { Wrapper } from './styles';

export const ComponentResources: React.FC = () => {
  const game = useContext(GameContext);

  const [amount, setAmount] = useState(0);
  const [hint, setHint] = useState(false);

  useEffect(
    () => game.tutorial.bind(TutorialStep.RESOURCES, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  useWorldUpdate(() => {
    setAmount(game.world.player.resources);
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

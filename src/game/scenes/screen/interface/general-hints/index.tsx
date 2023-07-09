import React, { useContext, useState, useEffect } from 'react';

import { GameContext } from '~lib/interface';
import { ComponentHint } from '~scene/basic/interface/hint';
import { TutorialStep } from '~type/tutorial';

import { Wrapper } from './styles';

export const ComponentGeneralHints: React.FC = () => {
  const game = useContext(GameContext);

  const [hint, setHint] = useState<string>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.UNSET_BUILDING: {
        return setHint('Click right mouse button to unset building');
      }
    }
  };

  const hideHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.UNSET_BUILDING: {
        return setHint(null);
      }
    }
  };

  useEffect(
    () => game.tutorial.bindAll({
      beg: showHint,
      end: hideHint,
    }),
    [],
  );

  return (
    hint && (
      <Wrapper>
        <ComponentHint side="bottom" align="center">
          {hint}
        </ComponentHint>
      </Wrapper>
    )
  );
};

ComponentGeneralHints.displayName = 'ComponentGeneralHints';

import { useGame } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { ComponentHint } from '~scene/basic/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';

import { Wrapper } from './styles';

export const ComponentGeneralHints: React.FC = () => {
  const game = useGame<IGame>();

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

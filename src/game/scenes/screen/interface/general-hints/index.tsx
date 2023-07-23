import { useGame } from 'phaser-react-ui';
import React, { useState, useEffect } from 'react';

import { Hint } from '~scene/system/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';

import { Wrapper } from './styles';

export const GeneralHints: React.FC = () => {
  const game = useGame<IGame>();

  const [hint, setHint] = useState<Nullable<string>>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.UNSET_BUILDING: {
        return setHint('Use [Right click] to stop build');
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
        <Hint side="top" align="center">
          {hint}
        </Hint>
      </Wrapper>
    )
  );
};

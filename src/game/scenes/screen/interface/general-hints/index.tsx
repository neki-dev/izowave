import React, { useState, useEffect } from 'react';

import { Tutorial } from '~lib/tutorial';
import { Hint } from '~scene/system/interface/hint';
import { TutorialStep } from '~type/tutorial';

import { Wrapper } from './styles';

export const GeneralHints: React.FC = () => {
  const [hint, setHint] = useState<Nullable<string>>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.STOP_BUILD: {
        return setHint('Use [Right click] to stop build');
      }
    }
  };

  const hideHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.STOP_BUILD: {
        return setHint(null);
      }
    }
  };

  useEffect(
    () => Tutorial.BindAll({
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

import React, { useState, useEffect } from 'react';

import { Tutorial } from '~lib/tutorial';
import { Hint } from '~scene/system/interface/hint';
import { LangPhrase } from '~type/lang';
import { TutorialStep } from '~type/tutorial';

import { Wrapper } from './styles';

export const GeneralHints: React.FC = () => {
  const [hint, setHint] = useState<Nullable<LangPhrase>>(null);

  const showHint = (step: TutorialStep) => {
    switch (step) {
      case TutorialStep.STOP_BUILD: {
        return setHint('TUTORIAL_STOP_BUILD');
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
        <Hint label={hint} side="top" align="center" />
      </Wrapper>
    )
  );
};

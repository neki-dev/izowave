import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { phrase } from '~lib/lang';
import { Tutorial } from '~lib/tutorial';
import { Button } from '~scene/system/interface/button';
import { Hint } from '~scene/system/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';

import { Modal } from './modal';
import { Wrapper } from './styles';

export const Skills: React.FC = () => {
  const game = useGame<IGame>();

  const [isOpened, setOpened] = useState(false);
  const [hint, setHint] = useState(false);

  const onClick = () => {
    Tutorial.Complete(TutorialStep.UPGRADE_SKILL);
    setOpened(true);
    game.toggleSystemPause(true);
  };

  const onClose = () => {
    setOpened(false);
    game.toggleSystemPause(false);
  };

  useEffect(() => (
    Tutorial.Bind(TutorialStep.UPGRADE_SKILL, {
      beg: () => setHint(true),
      end: () => setHint(false),
    })
  ), []);

  return (
    <>
      {isOpened && <Modal onClose={onClose} />}
      <Wrapper>
        <Button onClick={onClick} view={isOpened ? 'confirm' : undefined}>
          {phrase('SKILLS')}
        </Button>
        {hint && (
          <Hint label='TUTORIAL_CLICK_TO_UPGRADE' side="top" />
        )}
      </Wrapper>
    </>
  );
};

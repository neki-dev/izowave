import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { Modal } from './modal';

import { phrase } from '~core/lang';
import { Tutorial } from '~core/tutorial';
import { TutorialStep } from '~core/tutorial/types';
import type { Game } from '~game/index';
import { Button } from '~scene/system/interface/button';
import { Hint } from '~scene/system/interface/hint';

import { Wrapper } from './styles';

export const Skills: React.FC = () => {
  const game = useGame<Game>();

  const [opened, setOpened] = useState(false);
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
      {opened && (
        <Modal onClose={onClose} />
      )}
      <Wrapper>
        <Button onClick={onClick} view={opened ? 'confirm' : undefined}>
          {phrase('SKILLS')}
        </Button>
        {hint && (
          <Hint label='TUTORIAL_CLICK_TO_UPGRADE' side="top" />
        )}
      </Wrapper>
    </>
  );
};

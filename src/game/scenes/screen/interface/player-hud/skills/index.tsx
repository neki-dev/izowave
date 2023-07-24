import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { Button } from '~scene/system/interface/button';
import { Hint } from '~scene/system/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';

import { UpgradesList } from './list';
import { Wrapper } from './styles';

export const Skills: React.FC = () => {
  const game = useGame<IGame>();

  const [isOpened, setOpened] = useState(false);
  const [hint, setHint] = useState(false);

  const onClickButton = (event: React.MouseEvent<HTMLDivElement>) => {
    setOpened(!isOpened);
    event.stopPropagation();
  };

  const onClose = () => {
    setOpened(false);
  };

  useEffect(
    () => game.tutorial.bind(TutorialStep.UPGRADE_SKILL, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  return (
    <Wrapper>
      <Button onClick={onClickButton} active={isOpened} size='small'>
        SKILLS
      </Button>
      {isOpened && <UpgradesList onClose={onClose} />}
      {hint && !isOpened && (
        <Hint side="top" align="left">
          Click to upgrade player skills
        </Hint>
      )}
    </Wrapper>
  );
};

import cn from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

import { GameContext } from '~lib/interface';
import { ComponentHint } from '~scene/basic/interface/hint';
import { TutorialStep } from '~type/tutorial';

import { ComponentUpgradesList } from './list';
import { Wrapper, Button } from './styles';

export const ComponentUpgrades: React.FC = () => {
  const game = useContext(GameContext);

  const [isOpened, setOpened] = useState(false);
  const [hint, setHint] = useState(false);

  const onClickButton = () => {
    setOpened(!isOpened);
  };

  const onClose = () => {
    setOpened(false);
  };

  useEffect(
    () => game.tutorial.bind(TutorialStep.UPGRADE_PLAYER, {
      beg: () => setHint(true),
      end: () => setHint(false),
    }),
    [],
  );

  return (
    <Wrapper>
      <Button onClick={onClickButton} className={cn({ active: isOpened })}>
        SKILLS
      </Button>
      {isOpened && <ComponentUpgradesList onClose={onClose} />}
      {hint && !isOpened && (
        <ComponentHint side="top" align="left">
          Click to upgrade player skills
        </ComponentHint>
      )}
    </Wrapper>
  );
};

ComponentUpgrades.displayName = 'ComponentUpgrades';

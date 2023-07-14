import cn from 'classnames';
import { useGame } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { ComponentHint } from '~scene/basic/interface/hint';
import { IGame } from '~type/game';
import { TutorialStep } from '~type/tutorial';

import { ComponentUpgradesList } from './list';
import { Wrapper, Button } from './styles';

export const ComponentUpgrades: React.FC = () => {
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

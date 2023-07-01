import cn from 'classnames';
import React, { useState } from 'react';

import { ComponentUpgradesList } from './list';
import { Wrapper, Button } from './styles';

export const ComponentUpgrades: React.FC = () => {
  const [isOpened, setOpened] = useState(false);

  const onClickButton = () => {
    setOpened(!isOpened);
  };

  const onClose = () => {
    setOpened(false);
  };

  return (
    <Wrapper>
      <Button onClick={onClickButton} className={cn({ active: isOpened })}>
        SKILLS
      </Button>
      {isOpened && <ComponentUpgradesList onClose={onClose} />}
    </Wrapper>
  );
};

ComponentUpgrades.displayName = 'ComponentUpgrades';

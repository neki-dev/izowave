import { useGame } from 'phaser-react-ui';
import React from 'react';

import { SETTINGS } from '~const/game';
import { mapEntries } from '~lib/utils';

import { Param } from './param';
import { Wrapper } from './styles';

export const Settings: React.FC = () => {
  const game = useGame();

  return (
    <Wrapper>
      {mapEntries(SETTINGS, (type, data) => (
        (!data.onlyDesktop || game.device.os.desktop) && (
          <Param key={type} type={type} data={data} />
        )
      ))}
    </Wrapper>
  );
};

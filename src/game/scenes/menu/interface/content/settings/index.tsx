import React, { useMemo } from 'react';

import { SETTINGS } from '~const/game';
import { GameSettings, GameSettingsData } from '~type/game';

import { Param } from './param';
import { Wrapper } from './styles';

type Props = {
  disabled?: boolean
};

export const Settings: React.FC<Props> = ({ disabled }) => {
  const settingList = useMemo(() => Object.entries(SETTINGS) as [GameSettings, GameSettingsData][], []);

  return (
    <Wrapper>
      {settingList.map(([type, data]) => (
        <Param key={type} type={type} data={data} disabled={disabled} />
      ))}
    </Wrapper>
  );
};

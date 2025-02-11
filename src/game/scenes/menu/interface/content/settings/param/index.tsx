import { useGame } from 'phaser-react-ui';
import React, { useState } from 'react';

import { PARAM_VALUES } from './const';

import type { GameSettings, IGame } from '~game/types';
import { Setting } from '~scene/system/interface/setting';

type Props = {
  type: GameSettings
};

export const Param: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();

  const [currentValue, setCurrentValue] = useState(game.settings[type]);

  const updateSetting = (value: string) => {
    const enabled = value === 'ON';

    game.updateSetting(type, enabled);
    setCurrentValue(enabled);
  };

  return (
    <Setting
      label={type}
      values={PARAM_VALUES}
      currentValue={currentValue ? 'ON' : 'OFF'}
      onChange={updateSetting}
    />
  );
};

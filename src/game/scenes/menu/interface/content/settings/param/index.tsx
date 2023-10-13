import { useGame } from 'phaser-react-ui';
import React, { useState } from 'react';

import { Setting } from '~scene/system/interface/setting';
import { GameSettings, GameSettingsData, IGame } from '~type/game';
import { LangPhrase } from '~type/lang';

type Props = {
  type: GameSettings
  data: GameSettingsData
};

export const Param: React.FC<Props> = ({ type, data }) => {
  const game = useGame<IGame>();

  const [currentValue, setCurrentValue] = useState(game.settings[type]);

  const updateSetting = (value: string) => {
    game.updateSetting(type, value);
    setCurrentValue(value);
  };

  return (
    <Setting
      label={type}
      values={data.values as LangPhrase[]}
      currentValue={currentValue as LangPhrase}
      onChange={updateSetting}
    />
  );
};

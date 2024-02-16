import { useGame } from 'phaser-react-ui';
import React, { useMemo, useState } from 'react';

import type { GameSettings, IGame } from '../../../../../../types';
import type { LangPhrase } from '~lib/lang/types';
import { InterfaceTextColor } from '~lib/interface/types';
import { Setting } from '~scene/system/interface/setting';

type Props = {
  type: GameSettings
};

export const Param: React.FC<Props> = ({ type }) => {
  const game = useGame<IGame>();

  const [currentValue, setCurrentValue] = useState(game.settings[type]);

  const values = useMemo<{
    value: LangPhrase
    color?: InterfaceTextColor
  }[]>(() => [
    { value: 'ON' },
    { value: 'OFF', color: InterfaceTextColor.ERROR },
  ], []);

  const updateSetting = (value: string) => {
    const enabled = value === 'ON';

    game.updateSetting(type, enabled);
    setCurrentValue(enabled);
  };

  return (
    <Setting
      label={type}
      values={values}
      currentValue={currentValue ? 'ON' : 'OFF'}
      onChange={updateSetting}
    />
  );
};

import { useGame } from 'phaser-react-ui';
import React, { useState } from 'react';

import { GameSettings, GameSettingsData, IGame } from '~type/game';

import {
  Wrapper, Description, Values, Value,
} from './styles';

type Props = {
  type: GameSettings
  data: GameSettingsData
  disabled?: boolean
};

export const Param: React.FC<Props> = ({ type, data, disabled }) => {
  const game = useGame<IGame>();

  const [currentValue, setCurrentValue] = useState(game.settings[type]);

  const updateSetting = (value: string) => {
    if (disabled && !data.runtime) {
      return;
    }

    game.updateSetting(type, value);
    setCurrentValue(value);
  };

  return (
    <Wrapper>
      <Description>{data.description}</Description>
      <Values $disabled={disabled && !data.runtime}>
        {data.values.map((value) => (
          <Value
            key={value}
            onClick={() => updateSetting(value)}
            $active={currentValue === value}
          >
            {value}
          </Value>
        ))}
      </Values>
    </Wrapper>
  );
};

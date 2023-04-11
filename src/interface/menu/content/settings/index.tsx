import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { SETTINGS } from '~const/game';
import { GameContext } from '~lib/interface';
import { GameSettings, GameSettingsData } from '~type/game';

import { Wrapper, Setting, Values } from './styles';

type Props = {
  disabled?: boolean
};

export const ComponentSettings: React.FC<Props> = ({ disabled }) => {
  const game = useContext(GameContext);

  const [settings, setSettings] = useState(game.settings);

  const updateSetting = (key: GameSettings, value: string) => {
    game.updateSetting(key, value);

    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  return (
    <Wrapper>
      {Object.entries(SETTINGS).map(([key, data]: [GameSettings, GameSettingsData]) => (
        <Setting key={key}>
          <Setting.Description>{data.description}</Setting.Description>
          <Values className={cn({
            disabled: disabled && !data.runtime,
          })}>
            {data.values.map((value) => (
              <Values.Item
                key={value}
                onClick={(disabled && !data.runtime) ? undefined : () => updateSetting(key, value)}
                className={cn({
                  active: settings[key] === value,
                })}
              >
                {value}
              </Values.Item>
            ))}
          </Values>
        </Setting>
      ))}
    </Wrapper>
  );
};

ComponentSettings.displayName = 'ComponentSettings';

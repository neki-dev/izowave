import cn from 'classnames';
import React, { useContext, useState } from 'react';

import { GameContext } from '~lib/interface';
import { GameDifficulty } from '~type/game';

import { Select } from './styles';

type Props = {
  disabled?: boolean
};

export const ComponentDifficulty: React.FC<Props> = ({ disabled }) => {
  const game = useContext(GameContext);

  const [currentDifficulty, setCurrentDifficulty] = useState(
    game.difficultyType,
  );

  const updateDifficulty = (type: GameDifficulty) => {
    if (disabled) {
      return;
    }

    game.setDifficulty(type);
    setCurrentDifficulty(type);
  };

  return (
    <Select className={cn({ disabled })}>
      {Object.keys(GameDifficulty).map((type: GameDifficulty) => (
        <Select.Item
          key={type}
          onClick={() => updateDifficulty(type)}
          className={cn({
            active: currentDifficulty === type,
          })}
        >
          {type}
        </Select.Item>
      ))}
    </Select>
  );
};

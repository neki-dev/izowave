import { useGame } from 'phaser-react-ui';
import React, { useMemo } from 'react';

import { Button } from '~scene/system/interface/button';
import { GameDifficulty, IGame } from '~type/game';

import { Param } from './param';
import { Wrapper, Params } from './styles';

export const NewGame: React.FC = () => {
  const game = useGame<IGame>();

  const difficulties = useMemo(
    () => Object.keys(GameDifficulty) as GameDifficulty[],
    [],
  );

  const onChangeDifficulty = (difficulty: GameDifficulty) => {
    game.difficulty = difficulty;
  };

  const onClickStart = () => {
    game.startGame();
  };

  return (
    <Wrapper>
      <Params>
        <Param
          label="Difficulty"
          values={difficulties}
          defaultValue={game.difficulty}
          onChange={onChangeDifficulty}
        />
      </Params>
      <Button onClick={onClickStart} view='primary' size="medium">
        Start
      </Button>
    </Wrapper>
  );
};

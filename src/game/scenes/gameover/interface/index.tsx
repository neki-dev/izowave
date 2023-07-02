import React, { useContext } from 'react';

import { GameContext } from '~lib/interface';
import { GameStat } from '~type/game';

import { ComponentStats } from './stats';
import {
  Overlay, Wrapper, Label, Restart,
} from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const GameoverUI: React.FC<Props> = ({ stat, record }) => {
  const game = useContext(GameContext);

  const handleRestartClick = () => {
    game.restartGame();
  };

  return (
    <Overlay>
      <Wrapper>
        <Label>GAME OVER</Label>
        <ComponentStats stat={stat} record={record} />
        <Restart onClick={handleRestartClick}>PLAY AGAIN</Restart>
      </Wrapper>
    </Overlay>
  );
};

GameoverUI.displayName = 'GameoverUI';

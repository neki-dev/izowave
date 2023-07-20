import { useGame, useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { GameStat, IGame } from '~type/game';

import { Result } from './result';
import {
  Overlay, Wrapper, Label, Restart,
} from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const GameoverUI: React.FC<Props> = ({ stat, record }) => {
  const game = useGame<IGame>();

  const refScale = useRelativeScale<HTMLDivElement>(INTERFACE_SCALE);

  const handleRestartClick = () => {
    game.restartGame();
  };

  return (
    <Overlay ref={refScale}>
      <Wrapper>
        <Label>GAME OVER</Label>
        <Result stat={stat} record={record} />
        <Restart onClick={handleRestartClick}>PLAY AGAIN</Restart>
      </Wrapper>
    </Overlay>
  );
};

GameoverUI.displayName = 'GameoverUI';

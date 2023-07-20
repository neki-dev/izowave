import { useGame, useRelativeScale } from 'phaser-react-ui';
import React from 'react';

import { INTERFACE_SCALE } from '~const/interface';
import { Button } from '~scene/system/interface/button';
import { GameStat, IGame } from '~type/game';

import { Result } from './result';
import {
  Overlay, Wrapper, Label,
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
        <Button onClick={handleRestartClick} size='large'>PLAY AGAIN</Button>
        <Result stat={stat} record={record} />
      </Wrapper>
    </Overlay>
  );
};

GameoverUI.displayName = 'GameoverUI';

import React from 'react';

import { ComponentGameOver } from '~interface/gameover';
import { GameStat } from '~type/game';

import { Overlay } from './styles';

type Props = {
  stat: GameStat
  record: Nullable<GameStat>
};

export const GameoverUI: React.FC<Props> = (props) => (
  <Overlay>
    <ComponentGameOver {...props} />
  </Overlay>
);

GameoverUI.displayName = 'GameoverUI';

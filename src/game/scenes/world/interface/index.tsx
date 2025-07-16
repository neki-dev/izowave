import { useEvent, useGame } from 'phaser-react-ui';
import React, { useState } from 'react';

import { CrystalsAmount } from './crystals-amount';
import { GameOver } from './game-over';
import { RelativeBuildingInfo } from './relative-building-info';
import { RelativeHints } from './relative-hints';

import type { Game } from '~game/index';
import { GameEvent, GameState } from '~game/types';

export const WorldUI: React.FC = () => {
  const game = useGame<Game>();

  const [state, setState] = useState(game.state);

  useEvent(game.events, GameEvent.CHANGE_STATE, setState, []);

  return state === GameState.FINISHED ? (
    <GameOver />
  ) : (
    <>
      <RelativeBuildingInfo />
      <RelativeHints />
      <CrystalsAmount />
    </>
  );
};

import { useGame } from 'phaser-react-ui';
import React from 'react';

import { phrase } from '~lib/lang';
import { Button } from '~scene/system/interface/button';
import { GameState, IGame } from '~type/game';

import { Icon } from './styles';

export const MenuButton: React.FC = () => {
  const game = useGame<IGame>();

  const onClick = () => {
    if (game.state === GameState.STARTED) {
      game.pauseGame();
    }
  };

  return (
    <Button onClick={onClick}>
      <Icon>≡</Icon> {phrase('MENU')}
    </Button>
  );
};
